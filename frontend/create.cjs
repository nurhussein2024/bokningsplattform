// create.js
const fs = require("fs");
const path = require("path");

const type = process.argv[2]; // component, page, service
const name = process.argv[3];

if (!type || !name) {
  console.error("❌ Usage: node create.js [component|page|service] [Name]");
  process.exit(1);
}

const baseDir = {
  component: "src/components",
  page: "src/pages",
  service: "src/services"
}[type];

if (!baseDir) {
  console.error(`❌ Unknown type: ${type}`);
  process.exit(1);
}

const targetDir = path.join(baseDir, name);

if (type === "service") {
  const filePath = path.join(targetDir + ".ts");
  fs.writeFileSync(filePath, `// ${name} service\n\nexport const ${name} = () => {\n  // TODO\n};\n`);
  console.log(`✅ Service created at ${filePath}`);
} else {
  fs.mkdirSync(targetDir, { recursive: true });
  const filePath = path.join(targetDir, `${name}.tsx`);
  fs.writeFileSync(filePath, `// ${type}: ${name}\n\nexport const ${name} = () => {\n  return <div>${name}</div>;\n};\n`);
  console.log(`✅ ${type} created at ${filePath}`);
}
