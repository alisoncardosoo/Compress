<div align="center">

<img src="build/icon-source.png" width="120" alt="Logo do Compress" />

# Compress

### Compressão de imagens local, rápida e privada para macOS

Reduza o tamanho das suas imagens sem enviar nada para a nuvem. Tudo acontece no seu próprio Mac.

<br/>

![Status](https://img.shields.io/badge/status-ativo-success?style=for-the-badge)
![Plataforma](https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white)
![Versão](https://img.shields.io/badge/version-1.2.1-635BFF?style=for-the-badge)
![Licença](https://img.shields.io/badge/license-MIT-A78BFA?style=for-the-badge)
![PRs](https://img.shields.io/badge/PRs-welcome-success?style=for-the-badge)

![Electron](https://img.shields.io/badge/Electron-2C2E3B?style=flat&logo=electron&logoColor=9FEAF9)
![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Sharp](https://img.shields.io/badge/Sharp-99CC00?style=flat&logo=sharp&logoColor=white)

</div>

---

## 📚 Índice

- [Sobre](#-sobre)
- [Status](#-status)
- [Funcionalidades](#-funcionalidades)
- [Demonstração](#-demonstração)
- [Download](#-download)
- [Instalação](#-instalação)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Roadmap](#-roadmap)
- [Privacidade](#-privacidade)
- [Contribuição](#-contribuição)
- [Autor](#-autor)
- [Licença](#-licença)

---

## 💡 Sobre

O **Compress** é um aplicativo desktop para **macOS** que comprime e converte imagens **inteiramente no seu dispositivo**, sem nenhum upload para servidores externos.

A maioria das ferramentas de compressão exige enviar seus arquivos para a nuvem — o que significa lentidão, dependência de internet e dúvidas sobre o que acontece com suas imagens. O Compress resolve isso processando tudo localmente com a biblioteca [Sharp](https://sharp.pixelplumbing.com/), entregando velocidade nativa e privacidade total.

**Para quem é:** desenvolvedores, designers e qualquer pessoa que precisa reduzir o peso de imagens em lote — para a web, e-mail ou armazenamento — sem abrir mão de qualidade nem de privacidade.

**Diferenciais:**

- 🔒 100% offline — suas imagens nunca saem do seu Mac
- ⚡ Processamento nativo e em lote com a Sharp
- 🎛️ Controle fino de qualidade e formato de saída
- 🌗 Interface moderna com tema claro/escuro

---

## 🚦 Status

> 🟢 **Ativo** — em desenvolvimento contínuo. Versão atual: **`v1.2.1`**.

---

## 🔨 Funcionalidades

- 🖼️ **Compressão local** com suporte a `jpg`, `jpeg`, `png`, `webp`, `avif`, `heic` e `heif`
- 🔁 **Conversão de formato** de saída para `jpg`, `png`, `webp` e `avif`
- 📦 **Processamento em lote** com fila e indicador de progresso por arquivo
- 📊 **Estimativa de tamanho final** antes de exportar
- 💾 **Exportação flexível** — sobrescreva o original ou salve em uma pasta `Compress`
- 🌗 **Tema claro/escuro** com suporte nativo ao modo escuro do macOS
- ⌨️ **Atalhos rápidos** para abrir imagens, exportar e acessar preferências
- 🕑 **Histórico recente** das últimas compressões

---

## 🎬 Demonstração

<div align="center">

<!-- Substitua pela captura/GIF real da interface -->
<img src="docs/preview.png" width="720" alt="Interface do Compress" />

<sub>Arraste imagens, ajuste qualidade e formato, acompanhe o progresso e exporte.</sub>

</div>

---

## ⬇️ Download

O Compress é distribuído como um instalador **`.dmg`** para macOS.

1. Baixe a versão mais recente em [**Releases**](https://github.com/alisoncardosoo/Compress/releases).
2. Abra o `.dmg` e arraste o **Compress** para a pasta **Aplicativos**.
3. Abra o app e comece a comprimir.

> 💡 Você também pode gerar o build localmente — veja [Instalação](#-instalação).

---

## ⚙️ Instalação

### Pré-requisitos

- macOS
- [Node.js](https://nodejs.org/) 20 ou superior
- npm

### Clonar o repositório

```bash
git clone https://github.com/alisoncardosoo/Compress.git
```

### Entrar na pasta

```bash
cd Compress
```

### Instalar dependências

```bash
npm install
```

### Rodar em modo desenvolvimento

```bash
npm run dev
```

O comando inicia o Vite e abre o app Electron localmente.

### Scripts disponíveis

```bash
npm run dev          # Ambiente de desenvolvimento (Vite + Electron)
npm run lint         # Análise estática com ESLint
npm run typecheck    # Verificação de tipos com TypeScript
npm run build        # Gera o instalador .dmg em release/
npm run build:dir    # Gera o app desempacotado em release/
```

### Build para distribuição

```bash
npm run build
```

Os artefatos gerados são enviados para a pasta `release/`.

---

## 🧰 Tecnologias

<div align="center">

| Camada | Tecnologias |
|---|---|
| **Core / Desktop** | Electron 33 |
| **UI** | React 19 · TypeScript · Tailwind CSS · Framer Motion · Lucide |
| **Build** | Vite 6 · electron-builder |
| **Estado** | Zustand |
| **Processamento de imagem** | Sharp |
| **Persistência** | electron-store |

</div>

---

## 🏛️ Arquitetura

```text
📦 Compress
 ┣ 📂 src
 ┃ ┣ 📂 components   → Componentes da interface
 ┃ ┣ 📂 electron     → Processo principal, preload e canais IPC
 ┃ ┣ 📂 hooks        → Hooks de ações e preferências
 ┃ ┣ 📂 pages        → Tela principal da aplicação
 ┃ ┣ 📂 services     → Compressão de imagens e mocks de navegador
 ┃ ┣ 📂 store        → Estado global com Zustand
 ┃ ┣ 📂 types        → Tipagens compartilhadas
 ┃ ┗ 📂 utils        → Formatadores e presets
 ┣ 📂 scripts        → Automações de build e empacotamento
 ┗ 📂 build          → Assets de ícone
```

**Fluxo:** a interface React roda no renderer; a compressão é executada no processo principal do Electron via Sharp, comunicando-se com a UI por canais IPC tipados. Nenhum dado de imagem trafega pela rede.

---

## 🗺️ Roadmap

- [x] Compressão local em lote
- [x] Conversão entre formatos (`jpg`, `png`, `webp`, `avif`)
- [x] Tema claro/escuro
- [x] Histórico recente
- [ ] Presets de compressão personalizáveis
- [ ] Redimensionamento de imagens
- [ ] Versão para Windows e Linux

---

## 🔐 Privacidade

Todo o processamento acontece **localmente** via Sharp. O Compress **não faz upload** de arquivos para compressão e **não depende de internet** para funcionar. Suas imagens nunca saem do seu dispositivo.

---

## 🤝 Contribuição

Contribuições são bem-vindas!

1. Faça um **fork** do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Garanta que `npm run lint` e `npm run typecheck` passam
4. Commit: `git commit -m "feat: minha feature"`
5. Push: `git push origin feature/minha-feature`
6. Abra um **Pull Request**

Para bugs e sugestões, abra uma [Issue](https://github.com/alisoncardosoo/Compress/issues).

---

## 👤 Autor

<div align="center">

<a href="https://github.com/alisoncardosoo">
  <img src="https://github.com/alisoncardosoo.png" width="100" style="border-radius:50%" alt="Avatar de Alison Cardoso" />
</a>

**Alison Cardoso**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/alisoncardosoo)

</div>

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [`LICENSE`](LICENSE) para mais detalhes.

---

<div align="center">

Feito com ❤️ e ☕ por **Alison Cardoso**

<sub>⭐ Se este projeto te ajudou, deixe uma estrela no repositório!</sub>

</div>
