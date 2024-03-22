"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Button, Drawer, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import PDFViewer from "../(components)/PDFViewer";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";

import { globalStyles } from "styles";
import { PDF, ChatMessage, Chunk, Session } from "interfaces";
import Sessions from "app/chat/(components)/Sessions";
import ChatSection from "app/chat/(components)/ChatSection";
import { FixedSizeList } from "react-window";

import { get } from "utils/rest_utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const dummySessions = [
	{
		id: 0,
		created_at: new Date(),
		name: "Sessions on sessions",
	},
	{
		id: 1,
		created_at: new Date(),
		name: "Trump vs Biden Cage Match",
	},
	{
		id: 2,
		created_at: new Date("2024-03-14T10:00:00"),
		name: "Sessions 2",
	},
	{
		id: 3,
		created_at: new Date("2023-03-15T10:00:00"),
		name: "What's even the point of life?",
	},
];

const dummyMessages = [
	{
		id: 0,
		session_id: 3,
		message: "Hello, world!",
	},
	{
		id: 1,
		session_id: 3,
		message: "Hello, user!",
		chunks: [
			{
				id: 0,
				text: "Wind extinguishes a candle",
				pageNum: 16,
				pdfName: "Antifragile - Nassim Taleb",
				pdfID: 0,
			},
		],
	},
	{
		id: 2,
		session_id: 3,
		message: "What is a copypasta?",
	},
	{
		id: 3,
		session_id: 3,
		message:
			"A copypasta is a block of text copied and pasted to the Internet and social media. Copypasta containing controversial ideas or lengthy rants are often posted for humorous purposes, to provoke reactions from those unaware that the posted text is a meme.",
		chunks: [
			{
				id: 1,
				text: "I want to live happily in a world I don’t understand.",
				pageNum: 20,
				pdfName: "Antifragile - Nassim Taleb",
				pdfID: 0,
			},
		],
	},
	{
		id: 4,
		session_id: 3,
		message: "What is a copypasta?",
	},
	{
		id: 4,
		session_id: 3,
		message:
			'"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"',
		chunks: [
			{
				id: 2,
				text: "THE INVERSE TURKEY PROBLEM",
				pageNum: 250,
				pdfName: "Antifragile - Nassim Taleb",
				pdfID: 0,
			},
		],
	},
];

const Chat = ({ params }: { params: { session_id: string } }) => {
	const theme = useTheme();

	const token =
		typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

	const router = useRouter();

	const [pdfs, setPDFs] = useState<PDF[] | null>(null);
	const [selectedPDFID, setSelectedPDFID] = useState<number | null>(null);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [currentSessionId, setCurrentSessionId] = useState<number | null>(
		null
	);
	const [currentQuery, setCurrentQuery] = useState<string>("");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [highlightedChunks, setHighlightedChunks] = useState<Chunk[]>([]);
	const [currentPage, setCurrentPage] = useState<string>("1");
	const listRef = useRef<FixedSizeList>(null);

	const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

	useEffect(() => {
		router.prefetch("/filter");
		get(token, "/get-sessions", "Failed to fetch sessions.", (sessions) => {
			sessions.sort(
				(a: Session, b: Session) =>
					new Date(b.created_at).getTime() -
					new Date(a.created_at).getTime()
			);
			setSessions(sessions);
			get(
				token,
				`/get-pdfs/${sessions[0].id}`,
				"Failed to fetch PDFs.",
				(pdfs) => {
					setPDFs(pdfs);
				}
			);
		});
		// setPDFs([
		// 	{
		// 		id: 0,
		// 		pdf_document_name: "Antifragile - Nassim Taleb",
		// 		company: "Random House",
		// 		num_pages: 581,
		// 		filepath: "../antifragile.pdf",
		// 	},
		// 	{
		// 		id: 1,
		// 		pdf_document_name: "Shogun - James Clavell",
		// 		company: "Dell",
		// 		num_pages: 1081,
		// 		filepath: "../shogun.pdf",
		// 	},
		// ]);
	}, []);

	useEffect(() => {
		if (pdfs && pdfs.length > 0) {
			setSelectedPDFID(pdfs[0].id);
		}
	}, [pdfs]);

	const getSessionHistory = async (session_id: number) => {
		try {
			const response = await fetch(
				`http://localhost:8000/get-chat-history/${session_id}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw new Error("Failed to fetch session history.");
			} else {
				const chat_history = await response.json();
				setMessages(chat_history);
			}
		} catch (error) {
			console.error("Error fetching PDFs:", error);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				height: "100vh",
				background: theme.palette.primary.light,
				color: theme.palette.text.primary,
			}}
		>
			<Drawer
				sx={{
					width: globalStyles.drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: globalStyles.drawerWidth,
						boxSizing: "border-box",
					},
				}}
				variant="persistent"
				anchor="left"
				open={sidebarOpen}
			>
				<Sessions
					currentSessionId={currentSessionId}
					sessions={sessions}
					onClickSession={(id) => {
						setCurrentSessionId(id);
						getSessionHistory(id);
					}}
				/>
			</Drawer>

			<Box
				sx={{
					display: "flex",
					transition: "margin 150ms ease-in-out",
					marginLeft: `-${globalStyles.drawerWidth}px`,
					...(sidebarOpen && {
						transition: "margin 210ms ease-out",
						marginLeft: 0,
					}),
				}}
			>
				<ChatSection
					token={token}
					currentQuery={currentQuery}
					setCurrentQuery={setCurrentQuery}
					messages={dummyMessages}
					setMessages={setMessages}
					currentSessionId={currentSessionId}
					setHighlightedChunks={setHighlightedChunks}
					setCurrentPage={setCurrentPage}
					listRef={listRef}
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
					setSelectedPDFID={setSelectedPDFID}
				/>
				<PDFViewer
					pdf={pdfs?.find((pdf) => pdf.id == selectedPDFID) || null}
					highlightedChunks={highlightedChunks}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					listRef={listRef}
				/>
				<Box
					sx={{
						display: "flex",
						// background: "pink",
						borderLeft: 1,
						borderColor: theme.palette.text.primary,
						flexDirection: "column",
						width: "15%",
					}}
				>
					<Box
						sx={{
							height: globalStyles.headerHeight,
							borderBottom: 1,
							display: "flex",
							pl: 1.5,
							alignItems: "center",
						}}
					>
						<Typography variant="body2">
							Filtered documents
						</Typography>
					</Box>
					{pdfs == null ? (
						<Typography>Loading...</Typography>
					) : (
						pdfs.map((pdf) => {
							return (
								<Button
									key={pdf.id}
									onClick={() => {
										setSelectedPDFID(pdf.id);
									}}
									sx={{
										justifyContent: "flex-start",
										color: theme.palette.text.primary,
										textTransform: "none",
										borderBottom: 1,
										borderColor: theme.palette.text.primary,
										borderRadius: 0,
										"&:hover": {
											background:
												theme.palette.primary.dark,
										},
									}}
								>
									<Typography
										variant="caption"
										lineHeight={1.2}
									>
										{pdf.pdf_document_name}
									</Typography>
								</Button>
							);
						})
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default Chat;
