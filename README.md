# COCKPIT DIÁRIO TRANSPORTE

Painel diário de frota e motoristas da Colormaq (Filial BA e Matriz SP), publicado como página estática no GitHub Pages.

O painel tem filtros de data, unidade e categoria, modo claro/escuro e cinco abas: Visão geral, Frota, Motoristas, Tendência e Manutenções.

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | Página publicada (gerada, não editar à mão) |
| `painel.html` | Layout, estilos, cálculos e gráficos do painel |
| `runtime.js` | Lê os CSVs embutidos e redesenha a página quando um filtro muda |
| `veiculos.csv`, `motoristas.csv`, `historico.csv`, `manutencoes.csv` | Dados copiados da planilha *Fechamento Transporte FSA 2025.2* |
| `d3.min.js` | Biblioteca de gráficos D3 v7.9.0 (embutida no `index.html`) |
| `build.py` | Monta o `index.html` a partir dos arquivos acima |

## Como atualizar os dados

1. Substitua os arquivos CSV por versões novas, mantendo as mesmas colunas.
2. Rode `python3 build.py`.
3. Faça commit e push. O GitHub Pages publica a nova versão em cerca de 1 minuto.

### Colunas esperadas

- `veiculos.csv`: data, placa, unidade, categoria, tipo, marca, modelo, ano, rastreado, situacao, status, grupo, classe
- `motoristas.csv`: data, motorista, unidade, base, status, grupo, classe
- `historico.csv`: data, unidade, grupo, classe, veiculos
- `manutencoes.csv`: unidade, placa, tipo, entrada, saida, lead_time_dias, motivo, observacao

Datas no formato `AAAA-MM-DD`.

## Definições

- **Frota ativa**: veículos do Cockpit menos inativos e roubados.
- **Em operação**: carregado, em viagem, aguardando descarga, retorno, fluxo CD e manobra.
- **Parados**: manutenção, MEC e sinistro.
- **Utilização**: em operação ÷ frota ativa.
- **Disponibilidade**: (frota ativa − parados) ÷ frota ativa.
- **Presença**: motoristas sem férias, folga ou falta ÷ total.
