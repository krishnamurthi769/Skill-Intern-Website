async function main() {
    try {
        const res = await fetch("http://localhost:3000/api/tasks/3");
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Body:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
main();
