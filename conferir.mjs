// Confere o catálogo do jeito que o LionMultInstance confere: baixando cada pacote pela URL que
// está aqui e comparando com a soma que está aqui.
//
// ESTE ARQUIVO EXISTE POR UM ERRO CONCRETO, EM 27/10/2026. Publicar uma versão nova mexe em **três**
// campos que têm de andar juntos — `versao`, `pacote` e `sha256` —, e nessa publicação só dois
// andaram: a soma ficou a da versão anterior. O app baixou o pacote certo, comparou com a soma
// errada e cancelou a instalação, dizendo "O pacote baixado não confere com a soma publicada".
//
// A proteção funcionou. O que faltava era alguém conferir **antes** do push, e a conferência que eu
// tinha feito à mão olhava para a versão, para a URL e para o texto — tudo menos o único campo que
// o app realmente usa.
//
//     node conferir.mjs              # estrutura + baixa cada pacote e confere a soma
//     node conferir.mjs --sem-rede   # só a estrutura, para quando não há rede
//
// Sai com código 1 quando algo não bate, para servir de portão na automação.

import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const SEM_REDE = process.argv.includes('--sem-rede');

const falhas = [];
const reprovar = (onde, o) => falhas.push(`${onde}: ${o}`);

const catalogo = JSON.parse(await readFile(new URL('catalogo.json', import.meta.url), 'utf8'));

if (catalogo.versaoDoFormato !== 1) reprovar('catalogo', `versaoDoFormato ${catalogo.versaoDoFormato} não é 1`);
if (!Array.isArray(catalogo.extensoes) || !catalogo.extensoes.length)
  reprovar('catalogo', 'não há extensões');

/** Campos sem os quais o app não consegue instalar. O `aviso` é opcional de propósito. */
const OBRIGATORIOS = ['id', 'nome', 'jogo', 'resumo', 'atalho', 'sites', 'codigo', 'versao', 'pacote', 'sha256'];

const vistos = new Set();

for (const e of catalogo.extensoes ?? []) {
  const onde = e?.id || '(entrada sem id)';

  for (const campo of OBRIGATORIOS) {
    if (e?.[campo] === undefined || e[campo] === null || e[campo] === '')
      reprovar(onde, `falta o campo "${campo}"`);
  }
  if (!Array.isArray(e?.sites) || !e.sites.length) reprovar(onde, '"sites" tem de ser uma lista não vazia');

  if (vistos.has(e?.id)) reprovar(onde, 'id repetido');
  vistos.add(e?.id);

  // A soma tem de **parecer** uma soma. Um campo meio apagado numa edição à mão falharia no
  // download com uma mensagem muito pior do que esta.
  if (typeof e?.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(e.sha256))
    reprovar(onde, `sha256 não são 64 hexadecimais minúsculos: ${JSON.stringify(e?.sha256)}`);

  // **O laço que prende os três campos um ao outro.** A URL do pacote carrega a versão duas vezes,
  // na tag e no nome do arquivo; se a `versao` subiu e a URL não (ou ao contrário), aparece aqui.
  //
  // E isto fecha a corrente até o conteúdo: a automação do repositório da extensão recusa publicar
  // uma tag cuja versão não seja a do `manifest.json` dela. Logo `versao` daqui = tag da URL =
  // versão do manifesto lá dentro, sem este arquivo precisar abrir o zip.
  if (typeof e?.pacote === 'string' && typeof e?.versao === 'string') {
    if (!e.pacote.includes(`/v${e.versao}/`))
      reprovar(onde, `a URL do pacote não aponta para a tag v${e.versao}: ${e.pacote}`);
    if (!e.pacote.endsWith(`${e.id}-${e.versao}.zip`))
      reprovar(onde, `o nome do arquivo não é ${e.id}-${e.versao}.zip: ${e.pacote}`);
  }
}

if (!SEM_REDE) {
  for (const e of catalogo.extensoes ?? []) {
    const onde = e?.id || '(entrada sem id)';
    if (typeof e?.pacote !== 'string') continue;
    try {
      const r = await fetch(e.pacote);
      if (!r.ok) {
        reprovar(onde, `o pacote não baixou: HTTP ${r.status}`);
        continue;
      }
      const real = createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex');
      if (real === e.sha256) console.log(`OK     ${onde} ${e.versao}`);
      else {
        console.log(`FALHA  ${onde} ${e.versao}`);
        reprovar(onde, `a soma não bate\n     catálogo: ${e.sha256}\n     baixado:  ${real}`);
      }
    } catch (erro) {
      reprovar(onde, `não consegui baixar o pacote: ${erro?.message || erro}`);
    }
  }
} else {
  console.log('(--sem-rede: as somas não foram conferidas contra os pacotes)');
}

console.log('---');
if (falhas.length) {
  for (const f of falhas) console.error(`  ${f}`);
  console.error(`\n${falhas.length} problema(s). O catálogo assim quebra a instalação no app.`);
  process.exit(1);
}
console.log(`tudo confere — ${catalogo.extensoes.length} extensão(ões)`);
