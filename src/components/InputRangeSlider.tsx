import React, { FC, useState, InputeEvent, ChangeEvent } from 'react';
import './input-range-slider.scss';

interface Props {
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  value: number;
  // onInput?(event: InputeEvent): void;
  // onChange?(event: ChangeEvent): void;
};


const InputeRangeSlider: FC<Props> = ({
  defaultValue = 1.0,
  min = 0,
  max = 1,
  step = 0.01,
  onInput = () => {},
  // onChange = () => {}
}) => {

  const [value, setValue] = useState(1.0)
  const x = defaultValue * 100 / max
  const [bgColor, setBgColor] = useState(`linear-gradient(90deg, RGB(255, 255, 255, 1) ${x}%, RGB(255, 255, 255, 0.2) ${x}%)`);
  
  const handleInput = (e: InputeEvent) => {
    const x = e.target.value * 100 / max
    setBgColor(`linear-gradient(90deg, RGB(255, 255, 255, 1) ${x}%, RGB(255, 255, 255, 0.2) ${x}%)`)
    setValue(e.target.value)
    onInput(e.target.value)
  }
  
  return (
    <div className="replay__range-slider" style={{width:'100%'}}>
      <input 
        className="slider" 
        type="range" 
        min={min}
        max={max}
        value={value}
        step={step}
        onInput={handleInput}
        style={{background: bgColor}}
      />
    </div>
  )
})

export default InputeRangeSlider
