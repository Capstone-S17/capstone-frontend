import React from "react";
import { Box, Button, Divider, Icon } from "@mui/material";
import { globalStyles } from "../GlobalStyles";

const Header = ({}) => {
	return (
		<Box>
			<Box sx={{ mx: globalStyles.mx, backgroundColor: "" }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						height: `${globalStyles.headerHeight}vh`,
					}}
				>
					<Box
						sx={{
							"& > *": { marginRight: "25px" },
						}}
					>
						{/* <Icon></Icon> */}
						<a>Home</a>
						<a>Advanced Search</a>
						<a>Saved Reports</a>
					</Box>
					<Box sx={{ marginLeft: "auto" }}>
						<a>Hello, Cleopatra</a>
						<Icon />
					</Box>
				</Box>
			</Box>
			<Divider />
		</Box>
	);
};

export default Header;
