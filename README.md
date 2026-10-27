# Extensões do LionMultInstance

Catálogo das extensões oficiais, lido pelo LionMultInstance para montar a lista de instalação.

O arquivo é o [`catalogo.json`](catalogo.json). Cada entrada aponta para o repositório do código,
para o pacote publicado e para a soma SHA-256 desse pacote.

## Por que o código é aberto

Extensão tem acesso total à página do jogo. A única garantia real de que ela não rouba nada é você
poder ler o código — e são arquivos pequenos, de algumas dezenas de linhas.

Por isso cada extensão tem o seu próprio repositório público, o pacote é gerado a partir dele por
uma automação que só roda em tag, e a soma de verificação é publicada junto. O app confere essa
soma antes de instalar: se o arquivo baixado não for exatamente o publicado, a instalação para.

## Conferir antes de publicar

```
node conferir.mjs              # estrutura + baixa cada pacote e confere a soma
node conferir.mjs --sem-rede   # só a estrutura, para quando não há rede
```

Ele confere o catálogo **do jeito que o app confere**: baixando cada pacote pela URL que está aqui
e comparando com a soma que está aqui. Roda sozinho em todo push e todo pull request.

Existe por um erro concreto, em 27/10/2026. Publicar uma versão nova mexe em **três campos que têm
de andar juntos** — `versao`, `pacote` e `sha256` — e naquela publicação só dois andaram: a soma
ficou a da versão anterior. O app baixou o pacote certo, comparou com a soma errada e cancelou,
dizendo "O pacote baixado não confere com a soma publicada". A proteção funcionou; o que faltava
era conferir antes do push — e a conferência feita à mão tinha olhado para a versão, para a URL e
para o texto, tudo menos o único campo que o app realmente usa.

Por isso ele também prende os três campos um ao outro: a URL tem de apontar para a tag `v<versao>`
e terminar em `<id>-<versao>.zip`. Isso fecha a corrente até o conteúdo do pacote, porque a
automação de cada repositório de extensão recusa publicar uma tag cuja versão não seja a do
`manifest.json` dela — então `versao` daqui é a tag da URL, que é a versão de dentro do pacote.

## Quem publica

Só o dono do repositório. Qualquer pessoa pode ler, copiar e propor mudanças por pull request, mas
nada entra sem revisão, e nenhuma release sai de um pull request — apenas de uma tag.

## Fazer a sua própria extensão

Você não precisa desta lista. O LionMultInstance carrega qualquer extensão a partir de uma pasta,
pelo menu de extensões da janela. O catálogo existe só para poupar esse trabalho nas oficiais.

## Extensões

| Extensão | O que faz | Código |
| --- | --- | --- |
| PokePixel — qualidade de vida | As cinco ferramentas do PokePixel num pacote só, com menu `Alt+Q` | [repositório](https://github.com/lioncodetech/pokepixel-qualidade-de-vida) |
| Geral — anotações | Quadros de anotações flutuantes em qualquer site, `Alt+P` / `Alt+O` | [repositório](https://github.com/lioncodetech/geral-anotacoes) |
| Poke Idle World — qualidade de vida | Captura automática, loja, caçadas, times, escada de níveis, arrumar os painéis e parar o gráfico, com menu `Alt+Q` | [repositório](https://github.com/lioncodetech/pokeidleworld-qualidade-de-vida) |
| Leveling Idle — qualidade de vida | Modo leve, caçadas, poções, mochila, party, rotinas e fadiga, com menu `Alt+Q` | [repositório](https://github.com/lioncodetech/leveling-idle-qualidade-de-vida) |

### As avulsas saíram da lista

As cinco extensões soltas do PokePixel — ocultar popups, sem gráfico, senha, loja rápida e venda
rápida — não aparecem mais no catálogo: o pacote **qualidade de vida** faz as cinco, com um menu
para ligar e desligar cada uma. Os repositórios continuam públicos e as releases no ar, então quem
já instalou continua com a extensão funcionando e pode baixar o `.zip` à mão; o que não acontece
mais é o app oferecer a atualização delas pela loja.
