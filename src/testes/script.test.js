const { validaDadosPessoais, calculaTMB, calculaIMC, calculaAGUA, meta, dieta, validarAlimentos } = require('../script/script');

describe('validaDadosPessoais', () => {
    beforeEach(() => {
        // Simular ambiente DOM com checkboxes
        document.body.innerHTML = `
      <input type="checkbox" name="restricao" value="Glúten" />
      <input type="checkbox" name="restricao" value="Nenhuma" />
    `;
    });

    test('retorna erro se peso for inválido', () => {
        const erro = validaDadosPessoais('', 1.7, 25, 'masculino', 'ganhar');
        expect(erro).toBe('O campo "peso" deve ser preenchido com um número válido.');
    });

    test('retorna erro se nenhuma restrição for marcada', () => {
        const erro = validaDadosPessoais(70, 1.7, 25, 'masculino', 'ganhar');
        expect(erro).toBe('Você deve selecionar pelo menos uma restrição alimentar.');
    });

    test('retorna erro se "Nenhuma" for marcada junto com outra', () => {
        const inputs = document.getElementsByName('restricao');
        inputs[0].checked = true; // Glúten
        inputs[1].checked = true; // Nenhuma

        const erro = validaDadosPessoais(70, 1.7, 25, 'masculino', 'ganhar');
        expect(erro).toBe('Se você selecionar "Nenhuma", não pode marcar outras restrições.');
    });

    test('retorna null para dados válidos com uma restrição', () => {
        const inputs = document.getElementsByName('restricao');
        inputs[0].checked = true; // Glúten

        const erro = validaDadosPessoais(70, 1.7, 25, 'masculino', 'ganhar');
        expect(erro).toBeNull();
    });
});
describe('Testes do script', () => {
    // Mock de sessionStorage
    const mockSessionStorage = {
        store: {},
        setItem: jest.fn((key, value) => (mockSessionStorage.store[key] = value)),
        getItem: jest.fn((key) => mockSessionStorage.store[key] || null),
        clear: jest.fn(() => (mockSessionStorage.store = {})),
    };

    // Mock de window.alert para validarAlimentos
    const mockAlert = jest.fn();
    window.alert = mockAlert;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSessionStorage.store = {};

        // Definir sessionStorage
        Object.defineProperty(window, 'sessionStorage', {
            value: mockSessionStorage,
            writable: true,
        });

        // Simular ambiente DOM com checkboxes para validaDadosPessoais
        document.body.innerHTML = `
        <input type="checkbox" name="restricao" value="Glúten" />
        <input type="checkbox" name="restricao" value="Nenhuma" />
      `;
    });

    describe('validarAlimentos', () => {
        beforeEach(() => {
            // Mockar document.querySelectorAll para evitar DOM
            jest.spyOn(document, 'querySelectorAll').mockReturnValue([
                { value: 'Iogurte', checked: true },
                { value: 'Pao', checked: true },
            ]);
        });

        afterEach(() => {
            jest.spyOn(document, 'querySelectorAll').mockRestore();
        });

        test('lança erro se alimento selecionado conflita com restrição', () => {
            mockSessionStorage.store['restricoes'] = JSON.stringify(['Lactose']);
            expect(() => validarAlimentos()).toThrow('Você selecionou "Iogurte", que é incompatível com a restrição "Lactose".');
            expect(mockAlert).toHaveBeenCalledWith('Você selecionou "Iogurte", que é incompatível com a restrição "Lactose".');
        });

        test('não lança erro se não houver conflitos', () => {
            mockSessionStorage.store['restricoes'] = JSON.stringify(['Ovo']);
            expect(() => validarAlimentos()).not.toThrow();
            expect(mockAlert).not.toHaveBeenCalled();
        });

        test('não lança erro se não houver restrições', () => {
            mockSessionStorage.store['restricoes'] = JSON.stringify([]);
            expect(() => validarAlimentos()).not.toThrow();
            expect(mockAlert).not.toHaveBeenCalled();
        });
    });
});

describe('calculaTMB', () => {
    beforeEach(() => {
        document.body.innerHTML = `<input id="tmb" value="" />`;
    });

    test('calcula TMB corretamente para sexo masculino', () => {
        calculaTMB(70, 175, 25, 'masculino');
        const resultado = document.getElementById('tmb').value;
        const esperado = Math.floor((10 * 70) + (6.25 * 175) - (5 * 25) + 5);
        expect(Number(resultado)).toBe(esperado);
    });

    test('calcula TMB corretamente para sexo feminino', () => {
        calculaTMB(60, 165, 30, 'feminino');
        const resultado = document.getElementById('tmb').value;
        const esperado = Math.floor((10 * 60) + (6.25 * 165) - (5 * 30) - 161);
        expect(Number(resultado)).toBe(esperado);
    });

    test('retorna false para sexo inválido', () => {
        const retorno = calculaTMB(70, 175, 25, 'outro');
        expect(retorno).toBe(false);
    });
});

describe('calculaIMC', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="imc" value="" />
            <span id="categoria"></span>
        `;
    });

    test('classifica como "Abaixo do peso"', () => {
        calculaIMC(50, 170); // IMC ~17.3
        expect(Number(document.getElementById('imc').value)).toBe(Math.floor(17.3));
        expect(document.getElementById('categoria').textContent).toBe('Abaixo do peso');
    });

    test('classifica como "Peso normal"', () => {
        calculaIMC(65, 170); // IMC ~22.5
        expect(Number(document.getElementById('imc').value)).toBe(Math.floor(22.5));
        expect(document.getElementById('categoria').textContent).toBe('Peso normal');
    });

    test('classifica como "Sobrepeso"', () => {
        calculaIMC(80, 170); // IMC ~27.7
        expect(Number(document.getElementById('imc').value)).toBe(Math.floor(27.7));
        expect(document.getElementById('categoria').textContent).toBe('Sobrepeso');
    });

    test('classifica como "Obesidade"', () => {
        calculaIMC(95, 170); // IMC ~32.8
        expect(Number(document.getElementById('imc').value)).toBe(Math.floor(32.8));
        expect(document.getElementById('categoria').textContent).toBe('Obesidade');
    });
});

describe('calculaAGUA', () => {
    beforeEach(() => {
        document.body.innerHTML = `<input id="agua" value="" />`;
    });

    test('calcula corretamente a quantidade de água', () => {
        calculaAGUA(70); // 70 * 35 = 2450
        expect(Number(document.getElementById('agua').value)).toBe(2450);
    });
});

describe('meta', () => {
    beforeEach(() => {
        document.body.innerHTML = `<input id="meta" value="" />`;
    });

    test('define meta como "Emagrecer" se objetivo for "perder"', () => {
        meta('perder');
        expect(document.getElementById('meta').value).toBe('Emagrecer');
    });

    test('define meta como "Hipertrofia" se objetivo for outro valor', () => {
        meta('ganhar');
        expect(document.getElementById('meta').value).toBe('Hipertrofia');
    });
});

describe('dieta', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <span id="dieta"></span>
            <span id="descricao"></span>
        `;
    });

    test('define Mediterrânea corretamente', () => {
        dieta('M');
        expect(document.getElementById('dieta').textContent).toBe('Mediterrânea');
        expect(document.getElementById('descricao').textContent).toBe('Saúde cardiovascular e manutenção de peso');
    });

    test('define Low Carb corretamente', () => {
        dieta('L');
        expect(document.getElementById('dieta').textContent).toBe('Low Carb');
        expect(document.getElementById('descricao').textContent).toBe('Emagrecimento e controle glicêmico');
    });

    test('define Cetogênica corretamente', () => {
        dieta('C');
        expect(document.getElementById('dieta').textContent).toBe('Cetogênica');
        expect(document.getElementById('descricao').textContent).toBe('Perda de gordura rápida e aumento de foco');
    });

    test('define Vegetariana corretamente', () => {
        dieta('V');
        expect(document.getElementById('dieta').textContent).toBe('Vegetariana');
        expect(document.getElementById('descricao').textContent).toBe('Alimentação plant-based com proteínas completas');
    });

    test('define valor inválido se código desconhecido', () => {
        dieta('X');
        expect(document.getElementById('dieta').textContent).toBe('Valor inválido');
        expect(document.getElementById('descricao').textContent).toBe('');
    });
});
