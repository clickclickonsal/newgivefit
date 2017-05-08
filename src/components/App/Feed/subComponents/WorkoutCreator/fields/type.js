import React from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

export default ({ onChange, value }) => {
  return (
    <SelectField
      floatingLabelText='Type'
      value={value}
      onChange={(e, index, value) => onChange(value)}
    >
      <MenuItem value={'Walk'} primaryText='Walk' />
      <MenuItem value={'Yoga'} primaryText='Yoga' />
      <MenuItem value={'Bootcamp'} primaryText='Bootcamp' />
      <MenuItem value={'Zumba'} primaryText='Zumba' />
      <MenuItem value={'Dance'} primaryText='Dance' />
    </SelectField>
  )
}