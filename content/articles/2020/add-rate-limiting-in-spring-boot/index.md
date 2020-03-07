---
title: '使用Bucket4j进行访问量限制'
date: '2020-03-07'
categories:
  - Full Stack
---

事情是这样的，为了防止我们的应用因为 downstream 的应用出现无法预测的问题而被击溃，需要对 API 的访问量进行限制。

这个 case 中我们选择使用 [Bucket4j](https://github.com/vladimir-bukhtoyarov/bucket4j) 来实现。

## 令牌桶(token-bucket)算法

Bucket4j 采用令牌桶的方案来进行速率限制。官方的[文档](https://github.com/vladimir-bukhtoyarov/bucket4j/blob/master/doc-pages/token-bucket-brief-overview.md)和 [Wikipedia](https://en.wikipedia.org/wiki/Token_bucket)都有详细的介绍。

他的思路大致是这样的：

- 首先有一个用来装令牌的桶，它的容积是有限的，例如`20个`。
- 以一个恒定的速率向桶中注入令牌，例如`每秒10个`。当桶满的时候则扔掉那些无法注入的令牌。
- 当请求进入时，从桶中取出令牌，然后放行这个请求。每次可以取出的令牌数不一定是 1 个，也可以是多个。
- 如果请求进入时，桶中无法提供需要足够的令牌，则拒绝这个请求。这时不会消耗令牌。

相较于漏桶算法，令牌桶的优势在于可以更好的应对突发的流量变化，而不是一刀切的以恒定速率限流。

## 添加 filter

参考[官方示例](https://github.com/vladimir-bukhtoyarov/bucket4j/blob/master/doc-pages/basic-usage.md#example-3---limiting-the-rate-of-access-to-rest-api)，添加一个 filter 就可以实现对请求速率的拦截和过滤了。

这里选择实现 `javax.servlet.Filter` ，还是继承 `GenericFilterBean` 或 `OncePerRequestFilter` ，并不重要，实际是实现都是一样的。

```java
public class ThrottlingFilter extends OncePerRequestFilter {
  // 最大桶容量100
  private static final long OVERDRAFT = 100;

  // 每个周期生成的令牌个数
  private static final long MAX_REQUESTS_PER_PERIOD = 50;

  // 每个周期的长度
  private static final long SECONDS_PER_PERIOD = 1;

  private static final Refill refill = Refill.greedy(
    MAX_REQUESTS_PER_PERIOD,
    Duration.ofSeconds(SECONDS_PER_PERIOD)
  );

  // 令牌配置
  private static final BucketConfiguration bucketConfiguration = Bucket4j.configurationBuilder()
    .addLimit(Bandwidth.classic(OVERDRAFT, refill))
    .build();

  // 缓存及其管理器
  private javax.cache.Cache<String, GridBucketState> cache;
  private ProxyManager<String> buckets;

  public ThrottlingFilter(Cache<String, GridBucketState> cache) {
    this.cache = cache;
  }

  @Override
  protected void initFilterBean() {
    buckets = Bucket4j.extension(JCache.class).proxyManagerForCache(cache);
  }

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain chain
  )
    throws ServletException, IOException {
    // 获取这次请求的拦截标识，例如ip或username
    String id = getIdentificator();

    // 获取标识符对应的令牌桶
    Bucket bucket = buckets.getProxy(id, bucketConfiguration);

    // 尝试从桶中获取token
    if (bucket.tryConsume(1)) {
      // 如果获取成功则放行
      chain.doFilter(request, response);
    } else {
      // 如果不成功则返回429
      response.setContentType("test/plain");
      response.setStatus(429);
      response.getWriter().append("Too many requests.");
    }
  }
}
```

然后将这个 filter 添加到 filterChain 中。这里的示例选择添加到 Spring Security 的权限验证之后，因为我们的应用使用和权限有关的信息作为速率控制的标识。

```java
@Configuration
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
  private final CacheManager caffeineJCacheManager;

  public WebSecurityConfiguration(CacheManager caffeineJCacheManager) {
    this.caffeineJCacheManager = caffeineJCacheManager;
  }

  @Override
  public void configure(HttpSecurity http) {
    // 添加到HttpSecurity的配置中
    http.addFilterAfter(
      throttlingFilter(),
      AnonymousAuthenticationFilter.class
    );
  }

  @Bean
  ThrottlingFilter throttlingFilter() {
    Cache<String, GridBucketState> cache = caffeineJCacheManager.getCache(
      "cacheName"
    );
    return new throttlingFilter(cache);
  }
}
```

## 缓存

上文的示例中使用了 [Caffeine](https://github.com/ben-manes/caffeine) 和它的 [jCache Adapter](https://github.com/ben-manes/caffeine/wiki/JCache) 作为缓存。

在介绍 Caffeine 的配置之前，先介绍更简便的方案——可以直接使用一个 `ConcurrentHashMap` 来存放这些 id-bucket 的组合（当然这么做没法快速的实现过期的策略）。或者，使用类似的缓存方案，比如说 [`GuavaCache`](https://github.com/google/guava/wiki/CachesExplained) 。

实现一个简单的 `BucketCache` 类：

```java
public class BucketCache<K extends Serializable> {
  private LoadingCache<K, Bucket> bucketCache;

  public BucketCache(BucketConfiguration configuration) {
    bucketCache =
      CacheBuilder.newBuilder()
        // 缓存过期策略
      .expireAfterAccess(30, TimeUnit.MINUTES)
        .build(
          new CacheLoader<K, Bucket>() {

            @Override
            public Bucket load(K key) throws Exception {
              LocalBucketBuilder builder = Bucket4j.builder();
              for (Bandwidth bandwidth : configuration.getBandwidths()) {
                builder.addLimit(bandwidth);
              }
              return builder.build();
            }
          }
        );
  }

  public Bucket load(K key) throws ExecutionException {
    return bucketCache.get(key);
  }
}
```

在上述 filter 中将原有的 `cache` 和 `proxy` 替换为自己实现的 cache：

```java
public class ThrottlingFilter extends OncePerRequestFilter {
  private static BucketCache<String> buckets;

  @Override
  protected void initFilterBean() throws ServletException {
    buckets = new BucketCache<>(bucketConfiguration);
  }

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain chain
  ){
    // ...
    Bucket bucket = buckets.load(id)
    // ...
  }
}
```

当然这么做有些弊端，例如每次生成的 bucket 只能使用同一个配置，如果想要更多花样可能需要自己做更硬核一些的配置。

使用 Caffeine 作为缓存的配置也并不复杂，可以大致参考[官方示例](https://github.com/ben-manes/caffeine/blob/master/jcache/src/test/java/com/github/benmanes/caffeine/jcache/JCacheGuiceTest.java)。

新建一个 `CaffeineCacheConfiguration` 文件并生成 `javax.cache.CacheManager` 的 bean ：

```java
@Configuration
@EnableCaching
public class CaffeineCacheConfiguration {

  @Bean(name = "caffeineCachingProvider")
  public CachingProvider caffeineCachingProvider() {
    return new CaffeineCachingProvider();
  }

  @Bean(name = "caffeineJCacheManager")
  public CacheManager caffeineJCacheManager() {
    CacheManager cacheManager = caffeineCachingProvider().getCacheManager();
    Config config = ConfigFactory.load();
    CaffeineConfiguration<String, GridBucketState> apiTokenCacheConfiguration = TypesafeConfigurator.defaults(
      config
    );
    apiTokenCacheConfiguration.setExpiryPolicyFactory(
      FactoryBuilder.factoryOf( // 设置过期策略
        new AccessedExpiryPolicy(new Duration(TimeUnit.MINUTES, 10))
      )
    );
    apiTokenCacheConfiguration.setStoreByValue(false);
    cacheManager.createCache("cacheName", apiTokenCacheConfiguration);
    return cacheManager;
  }
}
```

然后如上文所示，在生成 ThrottlingFilter 的 bean 时将 manager 中的 cache 注入即可。

## 最后

以上是我们应用中对请求做速率限制的实现。如果需要其他实现方案，还可以参考：

- https://github.com/MarcGiffing/bucket4j-spring-boot-starter
- https://github.com/marcosbarbero/spring-cloud-zuul-ratelimit

## 参考

- https://github.com/vladimir-bukhtoyarov/bucket4j
- https://github.com/ben-manes/caffeine
- https://stackoverflow.com/questions/34809817/how-to-create-a-jcache-in-spring-java-config
