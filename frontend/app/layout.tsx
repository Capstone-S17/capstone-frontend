import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import styles from "./layout.module.css";

import ThemeWrapper from "@components/ThemeWrapper";

export const metadata = {
	title: "Handshakes",
	description: "Generated by Next.js",
};

export default function Layout(props: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={styles.root}>
				<ThemeWrapper>
					<AppRouterCacheProvider>
						{props.children}
					</AppRouterCacheProvider>
				</ThemeWrapper>
			</body>
		</html>
	);
}
