"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";

import { useRouter } from "next/navigation";
import NextLink from "next/link";

const Login = () => {
	const router = useRouter();

	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const onLogin = async () => {
		try {
			const response = await fetch("http://localhost:8000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: username,
					password: password,
				}),
			});
			if (!response.ok) {
				throw new Error("Failed to login.");
			} else {
				const data = await response.json();
				setUsername("");
				setPassword("");
				router.push("/home");
			}
		} catch (error) {
			console.error("Error logging in:", error);
		}
	};

	return (
		<Box sx={{ p: 2 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Typography sx={{ width: "10%" }}>Username: </Typography>
				<TextField
					size="small"
					id="username"
					label="Username"
					variant="outlined"
					value={username}
					onChange={(event) => {
						setUsername(event.target.value);
					}}
				/>
			</Box>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Typography sx={{ width: "10%" }}>Password: </Typography>
				<TextField
					size="small"
					id="username"
					label="Password"
					variant="outlined"
					value={password}
					onChange={(event) => {
						setPassword(event.target.value);
					}}
				/>
			</Box>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Link
					component={NextLink}
					href="/create-account"
					underline="hover"
					color="black"
					variant="body1"
					sx={{ width: "10%" }}
				>
					Create Account
				</Link>
				<Button
					onClick={() => onLogin()}
					sx={{ color: "white", background: "#3C3C3C", mt: 2 }}
				>
					Login
				</Button>
			</Box>
		</Box>
	);
};

export default Login;
