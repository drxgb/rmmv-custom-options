//=============================================================================
// XGB Custom Options
//=============================================================================

/*:
 * @author Dr.XGB
 * @plugindesc Permite criar opções personalizadas para o seu jogo.
 *
 * @param File Name
 * @desc O nome do arquivo que contém as opções personalizadas.
 * @type String
 * @default CustomOptions
 *
 *
 * @help
 * XGB Custom Options
 * ---------------
 * For RPG Maker MV
 * Version 1.0.0
 * https://drxgb.com
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 *                     INSTRUÇÕES DE USO DO PLUGIN
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 *
 * Ao baixar o plugin, certifique-se de que este plugin veio em um arquivo
 * compactado, como ZIP ou 7z, junto com um arquivo chamado CustomOptions.json.
 * Caso você deseja utilizar outro nome para este arquivo, lembre-se de que
 * você precisa renomear este arquivo e, em seguida, alterar o parâmetro
 * "File Name" no plugin com o mesmo nome deste arquivo, sem incluir a extensão.
 *
 * ---------------------------
 *
 * Mova o arquivo CustomOptions.json para a pasta data/ de seu projeto.
 * Este arquivo serve para você armazenar todas as opções personalizadas do jogo.
 * Fique à vontade para criar suas opções neste arquivo.
 * É muito importante seguir a estrutura proposta por este documento para que o
 * plugin funcione corretamente:
 *
 * [
 *     {
 *         "key": "foo",
 *         "title": "Foo property",
 *         "type": "boolean",
 *         "default": false,
 *     }
 * ]
 *
 * - key: A chave da propriedade da opção. Ele será armazenado como propriedade
 *        de ConfigManager. Portanto não utilize espaçamentos e caracteres
 *        especiais (com exceção do _).
 * - title: O nome de exibição da opção.
 * - type: O tipo da opção. Há dois tipos de opção:
 *     + boolean: Valores booleanos, ou seja, somente true ou false
 *     + select: Lista de valores onde o jogador navegará com as setas esquerda
 *               e direita para escolher a opção.
 * - default: O valor padrão da opção caso o mesmo ainda não foi configurado.
 *            Este atributo não é obrigatório.
 *
 */

// Referência do plugin
var Imported = Imported || {};
Imported.XGB = Imported.XGB || {};
Imported.XGB.CustomOptions = {
	active: true,
	version: 1000000,
};

var XGB = window.XGB || {};
window.XGB.CustomOptions = {};

var $dataCustomOptions = null;


(function ($)
{
	// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// * Parâmetros do plugin
	// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

	const pp = PluginManager.parameters('XGB_CustomOptions');


	// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// * Definição do objeto público do plugin
	// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

	$.fileName = pp['File Name'].trim();


	// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// * Funções do plugin
	// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// * Modificações nas classes do RMMV
	// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

	//* DataManager
	//  -----------

	const _DataManager_loadDatabase = DataManager.loadDatabase;
	const _DataManager_createGameObjects = DataManager.createGameObjects;


	/**
	 * Carrega o arquivo do banco de dados.
	 */
	DataManager.loadDatabase = function ()
	{
		_DataManager_loadDatabase.call(this);
		this.loadDataFile('$dataCustomOptions', `${$.fileName}.json`);
	};


	/**
	 * Cria os objetos essenciais do jogo.
	 */
	DataManager.createGameObjects = function ()
	{
		_DataManager_createGameObjects.call(this);
		ConfigManager.initializeCustomOptions();
		ConfigManager.load();
	};


	//* ConfigManager
	// --------------

	const _ConfigManager_makeData = ConfigManager.makeData;
	const _ConfigManager_applyData = ConfigManager.applyData;


	/**
	 * Cria os dados de configuração.
	 *
	 * @returns A configuração gerada.
	 */
	ConfigManager.makeData = function ()
	{
		const config = _ConfigManager_makeData.call(this);

		Object.entries($dataCustomOptions).forEach(([key, data]) =>
		{
			config[key] = this[key] !== undefined
				? this[key]
				: (data.default || false);
		});

		return config;
	};


	/**
	 * Aplica os dados de configuração.
	 *
	 * @param {any} config Os dados de configuração.
	 */
	ConfigManager.applyData = function (config)
	{
		_ConfigManager_applyData.call(this, config);

		if ($dataCustomOptions !== null)
		{
			this.applyCustomData(config);
		}
	};


	/**
	 * Inicializa as opções personalizadas.
	 */
	ConfigManager.initializeCustomOptions = function ()
	{
		Object.entries($dataCustomOptions).forEach(([key, data]) =>
		{
			if (data.type === 'boolean')
			{
				this[key] = data.default || false;
			}
			else if (data.type === 'select')
			{
				this[key] = data.default || 0;
			}
		});
	};


	/**
	 * Aplica os dados personalizados de configuração.
	 *
	 * @param {any} config Os dados de configuração.
	 */
	ConfigManager.applyCustomData = function (config)
	{
		Object.entries($dataCustomOptions).forEach(([key, data]) =>
		{
			if (data.type === 'boolean')
			{
				this[key] = this.readFlag(config, key) || data.default || false;
			}
			else if (data.type === 'select')
			{
				this[key] = this.readSelect(config, key, data.default);
			}
		});
	};


	/**
	 * Recebe o valor selecionado da opção.
	 *
	 * @param {any}		config			Os dados da configuração.
	 * @param {string}	name 			A chave da configuração a ser encontrada.
	 * @param {number}	defaultIndex	Índice padrão caso a configuração não seja encontrada.
	 * @returns 						O valor encontrado na configuração.
	 */
	ConfigManager.readSelect = function (config, name, defaultIndex)
	{
		const value = config[name];

		if (value !== undefined)
		{
			return value;
		}

		return defaultIndex || 0;
	};


	//* WindowOptions
	// --------------

	const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
	const _Window_Options_statusText = Window_Options.prototype.statusText;
	const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
	const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
	const _Window_Options_processOk = Window_Options.prototype.processOk;


	/**
	 * Adiciona as opções personalizadas após as configurações gerais.
	 */
	Window_Options.prototype.addGeneralOptions = function()
	{
		_Window_Options_addGeneralOptions.call(this);
		this.addCustomOptions();
	};


	/**
	 * Adiciona os comandos das opções personalizadas.
	 */
	Window_Options.prototype.addCustomOptions = function ()
	{
		Object.entries($dataCustomOptions).forEach(([key, data]) =>
		{
			this.addCommand(data.title, key);
		});
	};


	/**
	 * Recebe o texto da opção selecionada.
	 *
	 * @param {number} index	O índice da opção.
	 * @returns 				O texto da opção.
	 */
	Window_Options.prototype.statusText = function (index)
	{
		const symbol = this.commandSymbol(index);
		const value = this.getConfigValue(symbol);

		if (this.isSelectSymbol(symbol))
		{
			return this.selectStatusText(symbol, value);
		}

		return _Window_Options_statusText.call(this, index);
	};


	/**
	 * Recebe o texto da opção.
	 *
	 * @param {string} symbol	Símbolo da chave da opção.
	 * @param {number} value	Índice da opção.
	 * @returns 				O texto que representa a opção.
	 */
	Window_Options.prototype.selectStatusText = function (symbol, value)
	{
		return $dataCustomOptions[symbol].options[value];
	}


	/**
	 * Aumenta o valor do cursor.
	 *
	 * @param {any} wrap Sinal que indica se o cursor deve voltar para o começo caso estoure o índice.
	 */
	Window_Options.prototype.cursorRight = function (wrap)
	{
		const index = this.index();
		const symbol = this.commandSymbol(index);
		let value = this.getConfigValue(symbol);

		if (this.isSelectSymbol(symbol))
		{
			const options = $dataCustomOptions[symbol].options;

			++value;

			if (wrap)
			{
				value %= options.length;
			}
			else
			{
				value = value.clamp(0, options.length - 1);
			}

			this.changeValue(symbol, value);
		}
		else
		{
			_Window_Options_cursorRight.call(this, wrap);
		}
	}


	/**
	 * Diminui o valor do cursor.
	 *
	 * @param {any} wrap Sinal que indica se o cursor deve avançar para o final caso estoure o índice.
	 */
	Window_Options.prototype.cursorLeft = function (wrap)
	{
		const index = this.index();
		const symbol = this.commandSymbol(index);
		let value = this.getConfigValue(symbol);

		if (this.isSelectSymbol(symbol))
		{
			const options = $dataCustomOptions[symbol].options;
			const [ start, end ] = [ 0, options.length - 1 ];

			--value;

			if (wrap)
			{
				if (value < 0)
				{
					value = (options.length - Math.abs(value)).clamp(start, end);
				}
			}
			else
			{
				value = value.clamp(start, end);
			}

			this.changeValue(symbol, value);
		}
		else
		{
			_Window_Options_cursorLeft.call(this, wrap);
		}
	}


	/**
	 * Ação ao apertar o botão de ação.
	 */
	Window_Options.prototype.processOk = function ()
	{
		const index = this.index();
		const symbol = this.commandSymbol(index);
		let value = this.getConfigValue(symbol);

		if (this.isSelectSymbol(symbol))
		{
			const options = $dataCustomOptions[symbol].options;

			value = ++value % options.length;
			this.changeValue(symbol, value);
		}
		else
		{
			_Window_Options_processOk.call(this);
		}
	}


	/**
	 * Sinaliza se o símbolo refere-se a uma lista seletora.
	 *
	 * @param {string} symbol	Símbolo da chave da opção.
	 * @returns 				Sinal do símbolo de seleção.
	 */
	Window_Options.prototype.isSelectSymbol = function (symbol)
	{
		return $dataCustomOptions[symbol] && $dataCustomOptions[symbol].type === 'select';
	};
})(XGB.CustomOptions);