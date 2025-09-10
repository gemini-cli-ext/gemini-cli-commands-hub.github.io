
const fs = require('fs');
const path = require('path');
const toml = require('@ltd/j-toml');

const commandsDir = path.join(__dirname, '../src/commands');
const outputFile = path.join(__dirname, '../src/commands.json');

const parseCommentHeader = (content) => {
  const header = {
    name: '',
    usage: '',
    example: '',
  };
  const commandMatch = content.match(/#\s*Command:\s*(.*)/);
  if (commandMatch) header.name = commandMatch[1].trim();

  const usageMatch = content.match(/#\s*Usage:\s*(.*)/);
  if (usageMatch) header.usage = usageMatch[1].trim();

  const exampleMatch = content.match(/#\s*Example:\s*(.*)/);
  if (exampleMatch) header.example = exampleMatch[1].trim();

  return header;
};

try {
  const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.toml'));

  const commands = commandFiles.map(file => {
    const filePath = path.join(commandsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const header = parseCommentHeader(content);
    const parsedToml = toml.parse(content, { joiner: '\n' });

    const id = path.basename(file, '.toml');
    const labels = parsedToml.label ? parsedToml.label.split(',').map(s => s.trim()) : [];

    return {
      id,
      name: header.name,
      usage: header.usage,
      example: header.example,
      labels,
      description: parsedToml.description || '',
      prompt: parsedToml.prompt || '',
    };
  });

  fs.writeFileSync(outputFile, JSON.stringify(commands, null, 2));
  console.log(`Successfully parsed ${commands.length} commands and created ${outputFile}`);

} catch (error) {
  console.error('Error parsing command files:', error);
  process.exit(1);
}
