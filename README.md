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
| Geral — anotações | Quadros de anotações flutuantes em qualquer site, `Alt+X` / `Alt+Z` | [repositório](https://github.com/lioncodetech/geral-anotacoes) |

### As avulsas saíram da lista

As cinco extensões soltas do PokePixel — ocultar popups, sem gráfico, senha, loja rápida e venda
rápida — não aparecem mais no catálogo: o pacote **qualidade de vida** faz as cinco, com um menu
para ligar e desligar cada uma. Os repositórios continuam públicos e as releases no ar, então quem
já instalou continua com a extensão funcionando e pode baixar o `.zip` à mão; o que não acontece
mais é o app oferecer a atualização delas pela loja.
