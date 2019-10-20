import React, { FC, ChangeEvent } from 'react';
import './toggle-switch.scss';

interface Props {
  // checked?: booleanect
  defaultChecked?: boolean;
  onChange?(event: ChangeEvent): void;
};

const ToggleSwtich: FC<Props> = ({
  // checked,
  defaultChecked,
  onChange = () => {}
}) => (
  <div className="replay__toggle-switch">
    <label className="switch">
      <input 
        type="checkbox" 
        // checked={checked} 
        defaultChecked={defaultChecked} 
        onChange={onChange} 
      />
      <span className="slider"></span>
    </label>
  </div>
);

export default ToggleSwtich
