# XGB Custom Options
### Plugin para RPG Maker MV
&copy; 2024 - Dr.XGB

<hr />

## Sobre o plugin
Este plugin foi desenvolvido com ❤️ por Dr.XGB para o motor RPG Maker MV.
Sua função é permitir que o desenvolvedor possa criar opções personalizadas para seus jogos de forma dinâmica, sem precisar criar mais plugins somente para suportar novas configurações simples.

<hr />

## INSTRUÇÕES DE USO DO PLUGIN

Ao baixar o plugin, certifique-se de que este plugin veio em um arquivo compactado, como *ZIP* ou *7z*, junto com um arquivo chamado `CustomOptions.json`.
Caso você deseja utilizar outro nome para este arquivo, lembre-se de que você precisa renomear este arquivo e, em seguida, alterar o parâmetro `"File Name"` no plugin com o mesmo nome deste arquivo, sem incluir a extensão.

Mova o arquivo `CustomOptions.json` para a pasta `data/` de seu projeto.
Este arquivo serve para você armazenar todas as opções personalizadas do jogo. Fique à vontade para criar suas opções neste arquivo.
É muito importante seguir a estrutura proposta por este documento para que o plugin funcione corretamente:

#### Exemplos:
```json
{
    "foo": {
        "title": "Foo property",
        "type": "boolean",
        "default": false
    }
}
```
#### OU
```json
{
    "bar": {
        "title": "Bar propery",
        "type": "select",
        "options": [ "red", "yellow", "green" ],
        "default": 1
    }
}
```
A chave da propriedade da opção será armazenada como propriedade de `ConfigManager`. Portanto não utilize espaçamentos e caracteres especiais (com exceção do `_`).
 - **title:** O nome de exibição da opção.
 - **type:** O tipo da opção. Há dois tipos de opção:
     + **boolean:** Valores booleanos, ou seja, somente `true` ou `false`.
     + **select:** Lista de valores onde o jogador navegará com as setas esquerda e direita para escolher a opção.
 - **options:** A lista de opções quando o valor de `"type"` for `"select"`.
 - **default:** O valor padrão da opção caso o mesmo ainda não foi configurado. Quando o valor de `"type"` for `"select"`, este será considerado o índice da lista. Por exemplo: se nesta opção temos a lista: `[ "abacaxi", "banana", "caju", "damasco" ]` e `"default"` é `1`, então o valor padrão será exibido como `"banana"`. Este atributo não é obrigatório. Quando o atributo for omitido e o valor de `"type"` for `"boolean"`, o padrão será considerado o valor `false` e quando o valor de `"type"` for `"select"`, será considerado o primeiro índice da lista, ou seja, o valor `0`.