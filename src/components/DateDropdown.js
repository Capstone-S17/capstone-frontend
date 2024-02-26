import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";

const DateDropdown = ({ props }) => {
	return (
		<Box sx={{ background: "", height: props.height }}>
			<Typography
				sx={{
					height: `calc(${props.fontSize} + 5px)`,
					color: "#757575",
					mb: "5px",
					fontSize: props.fontSize,
				}}
			>
				{props.title}
			</Typography>
			<DatePicker
				label={props.date == null ? props.label : ""}
				value={props.date}
				onChange={props.onChange}
				renderInput={(params) => (
					<TextField
						InputLabelProps={{ shrink: false }}
						sx={{
							fontSize: "11px",
							width: props.width,
							height: "100%",
							"& .MuiOutlinedInput-root": {
								borderRadius: "30px",
								height: `calc(100% - ${props.fontSize} - 10px)`,
								fontSize: props.fontSize,
							},
							"& .MuiFormLabel-root": {
								ml: "6px",
								color: "#333333",
								mt: props.mt,
								fontSize: props.fontSize,
							},
							"& .MuiInputBase-inputAdornedEnd": {
								height: "100%",
								ml: "6px",
								color: "#333333",
							},
						}}
						{...params}
					/>
				)}
			/>
		</Box>
	);
};

export default DateDropdown;