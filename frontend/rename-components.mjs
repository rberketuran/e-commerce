// rename-components.mjs
import fs from "fs";
import path from "path";

const root = "./src/app"; // adjust if your components live elsewhere
const dryRun = false;     // set true to only log what would change

function isAngularComponent(content) {
    return /@Component\s*\(/.test(content);
}

function ensureClassNameEndsWithComponent(content) {
    // Replace "export class Foo" with "export class FooComponent" only if not already suffixed
    return content.replace(/export\s+class\s+([A-Za-z0-9_]+)/g, (m, cls) => {
        if (cls.endsWith("Component")) return m; // already fine
        return `export class ${cls}Component`;
    });
}

function updateTemplateAndStyleUrls(content, baseName) {
    // Replace templateUrl: './foo.html'  -> './foo.component.html'
    content = content.replace(/templateUrl\s*:\s*['"`](.+?)(\.html)['"`]/gs, (m, p1, p2) => {
        // If the template already has .component in its name, do nothing
        if (p1.endsWith(".component")) return m;
        return `templateUrl: '${p1}.component${p2}'`;
    });

    // Replace styleUrls: ['...','...'] possibly multiline
    content = content.replace(/styleUrls\s*:\s*\[\s*([^\]]*?)\s*\]/gs, (m, inner) => {
        // inner contains comma-separated strings; replace each file similarly
        const updatedInner = inner.replace(/['"`](.+?)(\.(css|scss|sass|less))['"`]/g, (mm, p1, p2) => {
            if (p1.endsWith(".component")) return mm;
            return `'${p1}.component${p2}'`;
        });
        return `styleUrls: [${updatedInner}]`;
    });

    return content;
}

function walk(dir) {
    for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            walk(filePath);
            continue;
        }

        if (!file.endsWith(".ts")) continue;

        let content = fs.readFileSync(filePath, "utf8");

        // Skip non-components quickly
        if (!isAngularComponent(content)) continue;

        const dirName = path.dirname(filePath);
        // Determine base name without .component (e.g., home.component.ts -> home)
        const fileNameNoExt = path.basename(filePath, ".ts"); // might be 'home' or 'home.component'
        const baseName = fileNameNoExt.replace(/\.component$/, ""); // 'home'

        // Rename matching html/css/scss files if they exist and are not already .component.*
        const exts = [".html", ".css", ".scss", ".sass", ".less"];
        for (const ext of exts) {
            const oldPath1 = path.join(dirName, `${baseName}${ext}`); // home.html
            const oldPath2 = path.join(dirName, `${baseName}.component${ext}`); // already correct
            const newPath = path.join(dirName, `${baseName}.component${ext}`);

            if (fs.existsSync(oldPath1) && !fs.existsSync(oldPath2)) {
                console.log(`${dryRun ? "[dry] Would rename" : "Renaming"}: ${oldPath1} → ${newPath}`);
                if (!dryRun) fs.renameSync(oldPath1, newPath);
            } else if (fs.existsSync(oldPath2)) {
                // already correct
            } else {
                // no file with either name - nothing to do
            }
        }

        // If TS file is still plain (home.ts) rename it to home.component.ts
        const tsHasComponentInName = /(^|\/)[^\/]+\.component\.ts$/.test(filePath);
        const newTsPath = tsHasComponentInName ? filePath : path.join(dirName, `${baseName}.component.ts`);
        if (!tsHasComponentInName) {
            console.log(`${dryRun ? "[dry] Would rename" : "Renaming"}: ${filePath} → ${newTsPath}`);
            if (!dryRun) fs.renameSync(filePath, newTsPath);
        }

        // Now update content (read the file at newTsPath if renamed)
        const tsToEdit = newTsPath;
        let updatedContent = fs.readFileSync(tsToEdit, "utf8");

        // Update templateUrl/styleUrls
        const before = updatedContent;
        updatedContent = updateTemplateAndStyleUrls(updatedContent, baseName);

        // Ensure class name ends with Component
        updatedContent = ensureClassNameEndsWithComponent(updatedContent);

        if (updatedContent !== before) {
            console.log(`${dryRun ? "[dry] Would update in file" : "Updating file"}: ${tsToEdit}`);
            if (!dryRun) fs.writeFileSync(tsToEdit, updatedContent, "utf8");
        } else {
            // still might need to update template/style references if TS rename happened but template names were already changed earlier
        }
    }
}

// run
console.log("Starting component sync...");
console.log(`Root folder: ${root}`);
console.log(`Dry run: ${dryRun ? "ENABLED" : "DISABLED"}`);
walk(root);
console.log("Done.");
