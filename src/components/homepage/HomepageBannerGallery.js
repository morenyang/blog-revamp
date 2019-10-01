import React from 'react'
import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import { curveMonotoneX } from '@vx/curve'
import { genDateValue } from '@vx/mock-data'
import { scaleTime, scaleLinear } from '@vx/scale'
import { LinearGradient } from '@vx/gradient'
import { extent, max } from 'd3-array'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { randomGradientColor } from '../../state/actions/color'

function genLines(num) {
  return new Array(num).fill(1).map(() => {
    return genDateValue(20)
  })
}

const series = genLines(12)
const data = series.reduce((rec, d) => {
  return rec.concat(d)
}, [])

// accessors
const x = d => d.date
const y = d => d.value

const HomePageBannerGallery = ({
  width,
  height,
  isGradient,
  gradient,
  randomGradientColor: randomGradient,
}) => {
  // bounds
  const xMax = width
  const yMax = height / 6

  // scales
  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, x),
  })
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, y)],
  })

  const handleClick = () => {
    randomGradient()
  }

  const gradientProps = isGradient ? gradient : { from: '#777', to: '#777' }

  return (
    <svg width={width} height={height} onClick={handleClick}>
      <LinearGradient {...gradientProps} id="stroke" />
      <rect x={0} y={0} width={width} height={height} fill="rgba(0,0,0,0)" />
      {xMax > 8 &&
        series.map((d, i) => {
          return (
            <Group key={`lines-${i}`} top={(i * yMax) / 2}>
              <LinePath
                data={d}
                x={_d => xScale(x(_d))}
                y={_d => yScale(y(_d))}
                stroke={'url(#stroke)'}
                strokeWidth={2}
                curve={i % 2 === 0 ? curveMonotoneX : undefined}
              />
            </Group>
          )
        })}
    </svg>
  )
}

const mapStateToProps = ({ color }) => ({
  isGradient: color.isGradient,
  gradient: color.gradient,
})

const mapDispatchToProps = dispatch => {
  return {
    randomGradientColor: bindActionCreators(randomGradientColor, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePageBannerGallery)
