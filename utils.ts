export async function generatePrivkey() {
    const command = new Deno.Command("wg", {
        args: [
            "genkey"
        ]
    })

    const { code, stdout, stderr } = await command.output();
    const tdStdout = new TextDecoder().decode(stdout);
    const tdStderr = new TextDecoder().decode(stderr);
    //console.log("stdout", tdStdout)

    if (code) throw new Error(`error while executing: ${tdStderr}`)

    return tdStdout;
}

export async function generatePubkey(privkey: string) {
    const command = new Deno.Command("wg", {
        args: ["pubkey"],
        stdin: "piped",
        stdout: "piped"
    })

    const process = command.spawn();

    const writer = process.stdin.getWriter();
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(privkey));
    await writer.close();

    const stdout2 = await new Response(process.stdout).text();

    const status = await process.status;
    if (!status.success) {
        throw new Error("wg pubkey failed");
    }
    return stdout2.trim()
}

export async function generatePsk() {
    const command = new Deno.Command("wg", {
        args: ["genpsk"]
    });

    const { stdout } = await command.output();
    const td = new TextDecoder().decode(stdout);
    return td;
}