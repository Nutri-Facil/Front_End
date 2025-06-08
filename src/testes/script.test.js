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