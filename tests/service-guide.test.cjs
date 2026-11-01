const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const context={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/service-guide.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,context);const answer=context.exports.serviceAnswer;
test('pricing is escalated rather than fabricated',()=>{const a=answer('What is the fulfillment price?');assert.equal(a.handoff,true);assert.match(a.text,/team/);assert.doesNotMatch(a.text,/AED\s*\d/);});
test('known sourcing question receives a useful answer',()=>{const a=answer('Can you source products?');assert.equal(a.handoff,false);assert.match(a.text,/quantity/);});
test('unknown questions request human follow-up',()=>{assert.equal(answer('I have a complaint about my last order').handoff,true);});
