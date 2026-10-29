# Ateliê Natália Lucena

Protótipo navegável em português brasileiro, com React, TypeScript estrito, Vite e Tailwind CSS 4. O pré-atendimento coleta preferências em memória e prepara uma mensagem para envio manual pelo WhatsApp.

## Instalação e execução

Requisitos: Node.js 20.19+ ou 22.12+ e npm, com acesso ao registro de pacotes.

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente http://localhost:5173).

```bash
npm run lint
npm test
npm run build
npm run preview
```

Uma checagem adicional das funções puras pode ser executada com `node scripts/verify-core.cjs`. O relatório local está em [VERIFICATION.md](VERIFICATION.md).

`dist/` contém o resultado do build. A hospedagem deve redirecionar rotas não encontradas para `index.html`, pois a aplicação usa React Router com histórico do navegador. Não há servidor ou banco de dados.

## WhatsApp oficial

Copie `.env.example` para `.env` e configure `VITE_WHATSAPP_NUMBER` com o número oficial, incluindo código do país e DDD, somente dígitos, sem `+`, espaços ou pontuação. Reinicie o Vite após alterar o arquivo. A variável é pública, incluída no frontend.

Não há telefone demonstrativo. Se a variável estiver ausente ou fora do formato internacional aceito, o site informa a pendência e oferece copiar a mensagem. Com o número configurado, o botão abre `https://wa.me/NUMERO?text=MENSAGEM`, apenas após clique. A cliente revisa e envia a mensagem manualmente no WhatsApp. A cópia usa Clipboard API, que requer HTTPS ou localhost; se indisponível, é possível selecionar e copiar o texto apresentado.

## Páginas e funcionalidades

- `/`: hero, serviços (incluindo noivas), apresentação textual da Natália, portfólio, cursos, FAQ, CTA e convite compacto para conhecer o espaço antes do rodapé. As fotografias de serviços da Home são somente visuais; títulos e CTAs continuam navegáveis.
- `/servicos` e `/servicos/:slug`: catálogo e template de detalhes para os quatro serviços.
- `/noivas`: redireciona para `/servicos`. A página e seus estilos estão isolados em `src/pages/Brides/` para reutilização futura. O serviço de noivas e seu pré-atendimento continuam ativos no catálogo.
- `/equipe`: redireciona para `/`, sem links públicos. O componente futuro está isolado em `src/pages/Team/Team.tsx` e depende dos perfis oficiais para ser reativado.
- `/portfolio`: referências demonstrativas, filtros por categoria e lightbox com teclado, Escape e contenção do foco.
- `/cursos`: apresentação e formulário validado de interesse.
- `/sobre`: apresentação institucional sem galeria de serviços ou retrato demonstrativo.
- `/espaco`: página ativa do espaço físico, com apresentação institucional e detalhes de localização. Mapa e direção dependem de endereço oficialmente confirmado.
- `/faq`: respostas agrupadas em acordeões nativos.
- `/agendar`: sete etapas com serviço, personalização, URLs, data e local, nome, revisão e mensagem. Serviço pode ser preselecionado por `?servico=maquiagem|penteado|completo|noiva`.
- Rota de página não encontrada, menu mobile, CTA inferior mobile, foco visível e redução de movimento.
- Orientação “Como funciona?” exclusivamente no Header, nos menus desktop e mobile, com o mesmo modal de quatro etapas, aviso sobre disponibilidade e CTA para `/agendar`.
- Botão circular de WhatsApp integrado ao contato fixo: usa somente o número configurado e abre uma explicação de pendência quando ele está ausente ou inválido. É ocultado em áreas de formulário, modais, rodapé e ao encontrar ações que poderia encobrir.

O formulário para noivas coleta estilo de maquiagem e penteado, quantidade de pessoas, interesse em acompanhantes, links, data do casamento, cerimônia, horário de preparação, local, nome, contato opcional e observações. Data e local são obrigatórios; o horário é opcional. A data mínima usa o dia local do navegador. A navegação entre etapas preserva as escolhas.

## Organização

| Arquivo | Responsabilidade |
| --- | --- |
| `src/config/brand.ts` | Nome da marca, cidade, canais oficiais e configuração do contato |
| `src/data/content.ts` | Serviços, imagens, categorias, equipe, opções de cursos, textos e perguntas |
| `src/pages/Pages.tsx` | Páginas institucionais e templates |
| `src/components/Layout.tsx` | Cabeçalho, navegação, rodapé e títulos/metadescrições |
| `src/components/ui.tsx` | Imagens com fallback, botões, acordeões, modal, mensagem e cópia |
| `src/components/PortfolioGallery.tsx` | Filtros e ampliação de referências |
| `src/components/Modal.tsx` | Portal com fundo inerte, foco contido, retorno ao acionador e animação opcional |
| `src/components/HowItWorksButton.tsx` | Acionador e orientação reutilizável, com conteúdo em `src/data/guidance.ts` |
| `src/components/ContactDock.tsx` | Contato flutuante, estado pendente e prevenção de sobreposição de controles |
| `src/components/LocationSection.tsx` | Detalhes de localização usados na página `/espaco`, sem mapa na Home |
| `src/lib/location.ts` | URLs de mapa e rota, criadas somente com endereço configurado |
| `src/features/booking/BookingWizard.tsx` | Formulário dinâmico de atendimento |
| `src/features/booking/CourseForm.tsx` | Interesse em cursos |
| `src/features/booking/model.ts` | Tipos, schemas Zod, resumo, formatação e URL do WhatsApp |
| `src/styles/index.css` | Tokens Tailwind, tipografia, composição e responsividade |
| `src/features/booking/*.test.*` | Regras de validação, mensagens e navegação do wizard |

Os objetos coletados e as funções de formatação estão separados da interface e do mecanismo de envio, permitindo substituir o transporte por um serviço futuro.

## Substituição do material demonstrativo

1. Confirme a grafia Lucena/Luccena em `src/config/brand.ts` e atualize também os metadados iniciais de `index.html`.
2. Configure o WhatsApp oficial no `.env`.
3. Substitua `photos` e `portfolio` em `src/data/content.ts` por fotografias autorizadas. Prefira arquivos WebP/AVIF em `public/images/`, com URLs locais e dimensões adequadas. Atualize os textos alternativos e remova os avisos de demonstração somente para o conteúdo efetivamente oficial.
4. Preencha `team` com nomes, especialidades, apresentação e fotos reais. Não há profissionais fictícios no projeto.
5. Preencha `brand.address` em `src/config/brand.ts` somente com o endereço completo oficialmente confirmado. O mapa integrado e o botão de direção da página `/espaco` serão ativados automaticamente com esse mesmo valor. Enquanto estiver `null`, vazio ou composto por espaços, essa página mostra apenas Niterói, RJ e o estado pendente, sem mapa nem rota fictícios. A Home permanece com um convite compacto, sem endereço e sem mapa, independentemente dessa configuração.
6. Atualize os cursos, programa, datas, duração e condições apenas com dados confirmados. A proposta atual permite consultar essas informações sem inventá-las.
7. Inclua avaliações somente com origem e autorização verificadas. Não há depoimentos fictícios.

Veja [IMAGE_SOURCES.md](IMAGE_SOURCES.md) para origem e licença das fotografias. As fotos atuais são externas e dependem de conexão; um fallback preserva a área da imagem quando ela falha. Google Fonts também depende de conexão, com fontes de sistema como alternativa.

## Validação e situação neste ambiente

Os 39 testes passaram: 12 de regras, 6 do pré-atendimento, 3 do portfólio, 1 de cursos, 3 da orientação, 4 do contato direto, 4 da localização e 6 da estrutura institucional. Incluem os quatro pedidos completos, validações, filtros, foco, ajuda restrita ao Header, fotografias não navegáveis na Home, preservação do catálogo e localização condicionada ao endereço oficial.

Na etapa de refinamento, as dependências já estavam instaladas. TypeScript, ESLint, Vitest e o build de produção foram aprovados. Como o sandbox Windows restringe a resolução de caminhos ancestrais, Vite e Vitest foram executados com configuração temporária equivalente, carregamento nativo e preservação de symlinks. Os scripts habituais acima continuam disponíveis para execução local. Consulte [VERIFICATION.md](VERIFICATION.md) para os comandos e os detalhes.

Nesta etapa, a revisão no Chrome ficou concentrada na Home e em `/espaco`, em 12 larguras (24 combinações), incluindo as dez solicitadas. Foram feitos 48 cliques nas fotografias da Home sem navegação, conferidos os enquadramentos e testado o botão “Conheça o espaço”. As fotografias externas estavam indisponíveis no navegador, portanto os fallbacks foram revisados; confirme os recortes com o acervo e as fontes carregados antes da publicação. O `package-lock.json` presente deve ser preservado; use `npm ci` para reinstalar suas versões.

## Refinamento visual

O hero e as seções foram simplificados, os textos e a faixa de benefícios solicitados foram removidos, e o rodapé foi reduzido a identidade, navegação essencial, dois perfis oficiais e informações básicas. A identificação do protótipo aparece discretamente no rodapé e no lightbox, sem atribuir as referências ao ateliê.

O portfólio contém somente Maquiagem social, Noivas e Penteados. A visualização inicial mostra as três categorias; um clique filtra, e outro clique no mesmo botão restaura a visão geral. O serviço de maquiagem e penteado continua no catálogo.

O CSS foi consolidado em uma abordagem mobile first, com grids de uma coluna em telas pequenas, tipografia fluida, áreas de toque de pelo menos 44px e campos a 16px. O CTA inferior não aparece nos formulários de atendimento e cursos. Os rótulos acessíveis foram separados das opções e instruções dos campos.

A Home não tem destaque exclusivo de noivas nem apresentação de equipe. Maquiagem, penteados, o serviço combinado e a produção para noivas continuam no catálogo; apenas a página exclusiva `/noivas` está temporariamente desativada. Os títulos “Inspirações” e “Referências para novos momentos.” foram retirados. O passo de links se chama “Referências visuais”, mantendo os mesmos campos e validações.

O contato direto usa um único conjunto de controles fixos: no mobile, o CTA do formulário e o WhatsApp ficam lado a lado; em telas maiores, permanece apenas o círculo de WhatsApp. O formulário completo segue sendo o fluxo principal. A ajuda do Header não é flutuante e não apaga escolhas ao abrir ou fechar. Parágrafos longos mantêm alinhamento de leitura, com centralização restrita a introduções e ações isoladas no mobile.

“Um lugar para o seu momento.” aparece depois do CTA final, em formato compacto, com a apresentação original e “Conheça o espaço” direcionando a `/espaco`. Não há endereço, mapa ou botão “Como chegar” na Home. A página do espaço reutiliza o componente de localização existente. Quando houver endereço confirmado, seu botão de direção usará o [formato oficial Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started); endereço e destino são codificados e compartilhados com o iframe. Nenhum endereço foi inventado.

## Limites da primeira versão

Não há disponibilidade em tempo real, reserva, confirmação, calendário, autenticação, pagamentos, CRM, API do WhatsApp ou envio automático. Valores, duração de serviços, políticas e condições comerciais são consultados com a equipe. Os dados pessoais ficam no estado da página e desaparecem ao recarregar; ao abrir o WhatsApp, os dados são incluídos na URL de sua mensagem. Nenhuma solicitação é transmitida a um backend deste projeto.
