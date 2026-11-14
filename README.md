# TC Mini — a private AI that runs entirely on your phone or PC

**Open-source, on-device chat AI. No account, no server, no telemetry — your chats never leave your device.** Runs in the browser with WebGPU (phones, laptops, desktops) or on your PC with Ollama / LM Studio / llama.cpp. Three sizes: **4B** (desktop), **1.7B** (balanced / phones), **0.6B** (any phone, 336 MB).

▶ **Open it on your phone or computer:** https://truthprotectors.github.io/TC-Mini/app/
⬇ **Download the weights:** https://huggingface.co/truthcoder/TC-Mini

## What's inside

| Build | Size (browser) | For | Model |
|---|---|---|---|
| Desktop · 4B | 2.3 GB | laptops / desktops with a GPU or Apple Silicon | Qwen3-4B abliterated |
| Balanced · 1.7B | 939 MB | newer phones, small laptops | Qwen3-1.7B abliterated |
| Mobile · 0.6B | 336 MB | any WebGPU phone | Qwen3-0.6B abliterated |

**Honest lineage:** these are the open **Qwen3** models with refusal directions removed ("abliterated", by [mlabonne](https://huggingface.co/mlabonne)), quantized by us to 4-bit for WebGPU (MLC `q4f16_1` / `q4f32_1`; the 4B uses AWQ-style channel scales folded into the norms, which cut 4-bit quality loss from KL 0.120 to 0.090 vs f16). They are not yet our own distilled model — each signed manifest says so. Measured: 0/8 refusals on our 8-prompt probe for every size; ~34 tok/s for the 4B in Chrome on an RTX 5070; the 0.6B is good for simple code and explanations, weak at arithmetic.

## Built to be trusted

- **Signed releases.** Every release has an Ed25519-signed `MANIFEST.json` listing the SHA-256 of every file. The app pins the public key (`02c6bedb…77ae`), verifies the signature in the browser, then hashes every downloaded shard before using it. A tampered mirror is refused before a single byte loads. Rollbacks to older releases are refused too.
- **Your device decides the size.** A capability check (GPU, shader-f16, memory, iOS/Android) picks a build that won't freeze your device. Phones never get the 4B, and integrated GPUs get a small context and prefill chunks, because a 4B model can hard-freeze a laptop's display driver.
- **Checked on your device.** Before the first chat, the exact build runs an 8-prompt response check on your hardware.
- **No telemetry.** The only network requests are the signed release files. Everything else runs locally, and it works offline after the first download.

## Use it on a PC (Ollama / LM Studio / llama.cpp)

| Size | GGUF repo | Q4_K_M | Best for |
|---|---|---|---|
| 4B | [truthcoder/TC-Mini-4B-GGUF](https://huggingface.co/truthcoder/TC-Mini-4B-GGUF) | 2.5 GB | desktops / laptops with a GPU or Apple Silicon |
| 1.7B | [truthcoder/TC-Mini-1.7B-GGUF](https://huggingface.co/truthcoder/TC-Mini-1.7B-GGUF) | 1.1 GB | small laptops, mini-PCs |
| 0.6B | [truthcoder/TC-Mini-0.6B-GGUF](https://huggingface.co/truthcoder/TC-Mini-0.6B-GGUF) | 0.4 GB | any computer |

```bash
# Ollama
ollama run hf.co/truthcoder/TC-Mini-4B-GGUF:Q4_K_M
# llama.cpp
llama-cli -hf truthcoder/TC-Mini-4B-GGUF:Q4_K_M
```
LM Studio: search **TC-Mini**. Q8_0 (near-lossless) and F16 files are in each repo too. Add `/no_think` to a message to skip the thinking step.

## Verify a release yourself (any machine with OpenSSH ≥ 8.2)

```bash
git clone https://huggingface.co/truthcoder/TC-Mini && cd TC-Mini/release/r1-2026-09-20-full
A=qwen3-4b-abl-q4f16_1
ssh-keygen -Y verify -f allowed_signers -I truthcoder-mini-release -n truthcoder-mini -s $A/MANIFEST.json.sig < $A/MANIFEST.json
python3 -c "import json;m=json.load(open('$A/MANIFEST.json'));[print(v['sha256'],' $A/'+k) for k,v in m['files'].items()]" | sha256sum -c
```

## Self-host

The app is static files — no build step. Serve `app/`, `vendor/`, `probe.js`, `fixtures.json` and `probe_constants.json` from any web server. To serve the weights yourself, put the `release/` folder from Hugging Face next to `app/` and set `window.TC_WEIGHTS=""` in `app/boot.js`. Any mirror is safe because of the signatures.

## License

App code: Apache-2.0. Model weights: Apache-2.0, inherited from [Qwen3](https://huggingface.co/Qwen) via [mlabonne/Qwen3-4B-abliterated](https://huggingface.co/mlabonne/Qwen3-4B-abliterated) (and the 1.7B / 0.6B siblings). Runtime: [WebLLM / MLC-LLM](https://github.com/mlc-ai/web-llm) (Apache-2.0).

Abliterated models answer requests that stock models refuse. You are responsible for how you use it.
