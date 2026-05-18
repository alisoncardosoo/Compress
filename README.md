# Compress

Aplicativo desktop para macOS que comprime imagens localmente com foco em privacidade, velocidade e fluxo em lote.

## Visao geral

O `Compress` foi construido com Electron, React, TypeScript e Sharp para processar imagens no proprio dispositivo, sem upload para servidores. A interface permite importar arquivos ou pastas, ajustar qualidade e formato de saida, acompanhar o progresso da compressao e exportar os resultados rapidamente.

## Principais recursos

- Compressao local de imagens com suporte a `jpg`, `jpeg`, `png`, `webp`, `avif`, `heic` e `heif`
- Processamento em lote com fila e indicador de progresso por arquivo
- Conversao de formato de saida para `jpg`, `png`, `webp` e `avif`
- Opcao de sobrescrever o arquivo original ou exportar para uma pasta `Compress`
- Tema claro/escuro e atalhos rapidos para abrir imagens, exportar e acessar preferencias
- Historico recente e estimativa de tamanho final antes da exportacao

## Stack

- Electron
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Sharp

## Estrutura do projeto

```text
src/
  components/   Componentes da interface
  electron/     Processo principal, preload e canais IPC
  hooks/        Hooks de acoes e preferencias
  pages/        Tela principal da aplicacao
  services/     Compressao de imagens e mocks de navegador
  store/        Estado global com Zustand
  types/        Tipagens compartilhadas
  utils/        Formatadores e presets
scripts/        Automacoes de build e empacotamento
build/          Assets de icone
```

## Requisitos

- macOS
- Node.js 20 ou superior
- npm

## Como rodar localmente

```bash
npm install
npm run dev
```

O comando acima inicia o Vite e abre o app Electron localmente.

## Scripts disponiveis

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run build:dir
```

## Build para distribuicao

```bash
npm run build
```

Os artefatos gerados sao enviados para a pasta `release/`.

## Privacidade

Todo o processamento das imagens acontece localmente via Sharp. O projeto nao depende de upload de arquivos para compressao.
