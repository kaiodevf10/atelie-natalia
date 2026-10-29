// Dependency-light checks for pure business rules. Pass a TypeScript module path
// as the first argument when the project's dependencies are not installed.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require(process.argv[2] || 'typescript');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/features/booking/model.ts'), 'utf8');
const ast = ts.createSourceFile('model.ts', source, ts.ScriptTarget.Latest, true);
const functions = ast.statements.filter(ts.isFunctionDeclaration)
  .map(statement => statement.getText(ast).replace(/^export /, '')).join('\n');
const transpile = code => ts.transpileModule(code, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText;
const content = {};
new Function('exports', transpile(fs.readFileSync(path.join(root, 'src/data/content.ts'), 'utf8')))(content);
const core = new Function('brand', 'services', `${transpile(functions)};
return { localToday, isValidPreferredDate, bookingRows, formatBookingMessage, whatsappUrl, formatCourseMessage };`
)({name: 'Ateliê Natália Lucena'}, content.services);
const passed = [];
function check(name, run) { run(); passed.push(name); }
const fixture = {service:'noiva',name:'Ana',phone:'',occasion:'',makeup:'Soft glam',hair:'Preso',length:'Médio',references:'https://pinterest.com/a',date:'2099-12-12',time:'',ceremony:'16:00',ready:'14:00',location:'No ateliê',people:'3',companions:true,notes:'Pele iluminada'};
check('Data local sem deslocamento UTC', () => assert.equal(core.localToday(new Date(2026,0,2,23,50)), '2026-01-02'));
check('Bloqueia datas passadas', () => assert.equal(core.isValidPreferredDate('2000-01-01'), false));
check('Bloqueia dias impossíveis', () => assert.equal(core.isValidPreferredDate('2099-02-31'), false));
check('Aceita data futura válida', () => assert.equal(core.isValidPreferredDate('2099-12-12'), true));
check('Mensagem de noiva completa', () => {
  const message = core.formatBookingMessage(fixture);
  for (const text of ['12/12/2099','16:00','14:00','Pessoas para produção: 3','Consultar acompanhantes: Sim','Soft glam','Preso','Pele iluminada','https://pinterest.com/a','não confirma uma reserva']) assert.ok(message.includes(text), text);
});
check('Omite campos alheios ao serviço', () => assert.ok(!core.formatBookingMessage({...fixture,service:'maquiagem'}).includes('Penteado:')));
check('Recusa números ausentes ou inválidos', () => {
  for (const number of [undefined,'','123','+5521999999999']) assert.equal(core.whatsappUrl(number,'Olá'), null);
});
check('Codifica acentos e quebras de linha', () => {
  const message = 'Olá!\nNatália & Ana';
  assert.equal(core.whatsappUrl('5521999999999',message),'https://wa.me/5521999999999?text='+encodeURIComponent(message));
});
check('Mensagem direta de interesse no curso', () => assert.equal(core.formatCourseMessage({name:' Ana ',course:'Curso de automaquiagem',level:'Nunca maquiei',notes:' '}), 'Olá! Meu nome é Ana e tenho interesse no Curso de automaquiagem. Meu nível: Nunca maquiei.'));
check('Orientação para escolher o curso', () => assert.equal(core.formatCourseMessage({name:'Ana',course:'Ainda não sei, quero orientação',level:'Já me maquio',notes:''}), 'Olá! Meu nome é Ana. Ainda não sei qual curso escolher e gostaria de orientação. Meu nível: Já me maquio.'));
const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
    const filename = path.join(directory,entry.name);
    if (entry.isDirectory()) walk(filename);
    else if (/\.tsx?$/.test(filename)) files.push(filename);
  }
}
walk(path.join(root,'src'));
files.push(path.join(root,'vite.config.ts'));
for (const file of files) {
  const result = ts.transpileModule(fs.readFileSync(file,'utf8'), {
    fileName:file, reportDiagnostics:true,
    compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX,verbatimModuleSyntax:true}
  });
  assert.equal(result.diagnostics?.length ?? 0, 0, `Sintaxe: ${file}`);
}
console.log(`${passed.length} verificações de regras puras aprovadas; ${files.length} arquivos com sintaxe válida.`);
