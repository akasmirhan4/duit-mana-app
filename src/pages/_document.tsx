import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;600;700&display=swap" rel="stylesheet" />
					<meta charSet="utf-8" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta name="description" content="Money Tracking App" />
					<meta name="theme-color" content="#320541" />
					<link rel="manifest" href="/manifest.json" />
					<link rel="shortcut icon" href="/favicon.ico" />
					<link rel="apple-touch-icon" href="/apple-icon.png"></link>
				</Head>
				<body>
					<Main />
					<NextScript />
					<div id="portal-container" />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
