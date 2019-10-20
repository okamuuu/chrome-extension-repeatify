import React, { FC, ChangeEvent, useState } from 'react';
import styled from "styled-components"

const TIME_REGEX = /^([0-9])?:?([0-5]?[0-9]):([0-5][0-9])$/

function isFormattedTime(str: string) {
  return str.match(TIME_REGEX)
}

function toSeconds(formattedTime: string): number {
  const mateches = formattedTime.match(TIME_REGEX)
  if (!mateches) {
    throw new Error(`invalid time formate: ${formattedTime}`)
  }
  const [_, HH, mm, ss] = mateches
  const hours = HH ? parseInt(HH, 0) * 60 * 60 : 0
  const minutes = mm ? parseInt(mm, 0) * 60 : 0
  const seconds = ss ? parseInt(ss, 0) : 0
  return hours + minutes + seconds
}

const InputText = styled.input`
  font-size: 14px;
  width: 60px;
  margin-left: 0.5em;
  padding: 0.4em;
  border: none;
  border-radius: 2px;
  &::placeholder {
    color: #ddd;
  }
`;

interface Props {
  // checked?: booleanect
  defaultValue?: number;
  placeholder?: string;
  onChange?(event: ChangeEvent): void;
};

const InputFormattedTime: FC<Props> = ({
  defaultValue,
  placeholder = "0:30",
  onChange = () => {}
}) => {

  const [invalid, setInvalid] = useState(false);

  const handleChange = (e: ChangeEvent) => {
    if (!isFormattedTime(e.target.value)) {
      setInvalid(true)
      onChange()
      return
    }
    setInvalid(false)
    onChange(e.target.value)
  }
  
  return (
    <InputText type="text" maxlength="7" defaultValue={defaultValue} placeholder={placeholder} onChange={handleChange} style={{color: invalid ? '#bbb' : 'black'}} />
  )
}

export default InputFormattedTime
