const { validaDadosPessoais } = require('../script/script');

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