import React, { useState } from 'react'
import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import { curveMonotoneX } from '@vx/curve'
import { genDateValue } from '@vx/mock-data'
import { scaleTime, scaleLinear } from '@vx/scale'
import {
  GradientDarkgreenGreen,
  GradientLightgreenGreen,
  GradientOrangeRed,
  GradientPinkBlue,
  GradientPinkRed,
  GradientPurpleOrange,
  GradientPurpleRed,
  GradientPurpleTeal,
  GradientSteelPurple,
  GradientTealBlue,
} from '@vx/gradient'
import { extent, max } from 'd3-array'

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

const HomePageBannerGallery = ({ width, height }) => {
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

  const gradientGroup = {
    GradientDarkgreenGreen,
    GradientLightgreenGreen,
    GradientOrangeRed,
    GradientPinkBlue,
    GradientPinkRed,
    GradientPurpleOrange,
    GradientPurpleRed,
    GradientPurpleTeal,
    GradientSteelPurple,
    GradientTealBlue,
  }

  const getRandomGradientName = () => {
    const names = Object.keys(gradientGroup).filter(
      item => item !== gradientName
    )
    const index = Math.floor(Math.random() * names.length)
    return names[index]
  }

  const [gradientName, setGradientName] = useState(getRandomGradientName())

  const Gradient = gradientGroup[gradientName]

  const handleClick = () => {
    setGradientName(getRandomGradientName())
  }

  return (
    <svg width={width} height={height} onClick={handleClick}>
      <Gradient id="stroke" />
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

export default HomePageBannerGallery
