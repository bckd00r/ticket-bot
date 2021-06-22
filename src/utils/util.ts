export function regEscape(str: string): string {
	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
export function formatBytes(bytes: number, decimals?: number): string {
	if (bytes === 0) return "0 Byte";
	const k = 1024;
	const dm = decimals || 3;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

exports = { regEscape, formatBytes };
