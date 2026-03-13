# 🎮 XIXIBOLA PRIME - Guia TWA para Play Store

## 📋 O que é TWA?

**Trusted Web Activity (TWA)** permite transformar sua PWA em um app Android nativo para publicar na Google Play Store. O app roda em tela cheia, sem barra de endereço do navegador.

---

## ✅ Pré-requisitos

1. **Seu jogo publicado com HTTPS** (Vercel, Netlify, etc.)
2. **Java JDK 11+** instalado
3. **Node.js 16+** instalado
4. **Conta de desenvolvedor Google Play** ($25 única vez)

---

## 🚀 Passo a Passo

### 1. Instalar Bubblewrap

```bash
npm install -g @anthropic/bubblewrap
```

### 2. Inicializar o projeto TWA

```bash
# No diretório do projeto
bubblewrap init --manifest https://seu-dominio.vercel.app/manifest.json
```

Ou use o arquivo `twa.json` já criado:

```bash
bubblewrap init --config twa.json
```

### 3. Gerar Keystore (para assinar o app)

```bash
keytool -genkey -v -keystore android.keystore -alias xixibola -keyalg RSA -keysize 2048 -validity 10000
```

**⚠️ GUARDE ESTE ARQUIVO!** Você precisará dele para atualizar o app na Play Store.

### 4. Obter SHA-256 Fingerprint

```bash
keytool -list -v -keystore android.keystore -alias xixibola
```

Copie o **SHA-256** e atualize o arquivo:
```
public/.well-known/assetlinks.json
```

Substitua `YOUR_SHA256_FINGERPRINT_HERE` pelo valor real.

### 5. Fazer deploy atualizado

```bash
git add .
git commit -m "Add TWA configuration"
git push
```

### 6. Gerar APK (para testes)

```bash
bubblewrap build
```

O APK estará em `./app-release.apk`

### 7. Gerar AAB (para Play Store)

```bash
bubblewrap build --release
```

O AAB estará em `./app-release.aab`

---

## 📱 Publicar na Play Store

1. Acesse [Play Console](https://play.google.com/console)
2. Clique em **"Criar app"**
3. Preencha:
   - Nome: **XIXIBOLA PRIME**
   - Idioma: **Português (Brasil)**
   - Gratuito/Pago: **Gratuito**
4. Vá em **"Versões de produção"** → **"Criar nova versão"**
5. Faça upload do arquivo `.aab`
6. Preencha a descrição da loja:

### 📝 Descrição para Play Store

```
🔥 XIXIBOLA PRIME - Elemental Strategy Arena 🔥

O Ultimate Tic-Tac-Toe mais épico que você já jogou!

Combine estratégia com poderes elementais nesta versão evoluída do jogo clássico. Escolha entre 6 elementos poderosos e domine a arena!

⚡ RECURSOS:
• Ultimate Tic-Tac-Toe com mecânicas únicas
• 6 Elementos: Fogo, Gelo, Raio, Vento, Trevas e Luz
• Jogue contra IA em 3 níveis de dificuldade
• Modo 2 jogadores local
• Sistema de progressão e conquistas
• Guardiões elementais para colecionar
• Funciona 100% offline

🎮 COMO JOGAR:
• 9 tabuleiros em um - cada jogada determina onde o adversário joga
• Vença 3 tabuleiros em linha ou 5 no total
• Use poderes elementais estrategicamente
• Domine a arena e torne-se o campeão!

📱 Totalmente gratuito, sem anúncios, sem compras!
```

---

## 🔧 Configuração do assetlinks.json

O arquivo `public/.well-known/assetlinks.json` DEVE conter seu SHA-256:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.xixibola.prime",
      "sha256_cert_fingerprints": [
        "14:6D:E9:83:C5:CE:..."  <- SEU SHA-256 REAL
      ]
    }
  }
]
```

**⚠️ IMPORTANTE:** Sem isso, o app não abrirá em tela cheia!

---

## 📦 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `twa.json` | Configuração do Bubblewrap |
| `public/.well-known/assetlinks.json` | Verificação de domínio |
| `public/manifest.json` | Manifest atualizado para TWA |

---

## 🆘 Problemas Comuns

### App não abre em tela cheia
- Verifique se `assetlinks.json` está acessível em `https://seu-dominio/.well-known/assetlinks.json`
- Confirme que o SHA-256 está correto

### Erro de keystore
- Use sempre o mesmo keystore para atualizações
- Guarde backup do keystore em local seguro

### App não aparece na Play Store
- A revisão demora 1-3 dias
- Verifique se preencheu todos os campos obrigatórios

---

## 📚 Links Úteis

- [Documentação Bubblewrap](https://developer.chrome.com/docs/android/bubblewrap/)
- [PWA para Play Store](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Requisitos PWA](https://web.dev/pwa-checklist/)

---

**Boa sorte com seu lançamento! 🚀**
