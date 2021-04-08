'use strict'
const tf = require('@tensorflow/tfjs');

let entradas = [];
let classes = [];

class BayesService {

    constructor(classe, entrada) {
        classes = classe;
        entradas = entrada;
    }

    async execBayers(tokenization) {
        let nomeClasses = await  this.retornaClasses();
        let probabilidade = [];

        for (let x = 0; x < tokenization.length; x++) {
            let Naive = await this.naiveBayes(tokenization[x]);

            for (let i = 0; i < nomeClasses.length; i++) {
                let percentual = parseFloat(Naive[nomeClasses[i]] * 100).toFixed(2);
                if (percentual >= 50) probabilidade.push(nomeClasses[i]);
            }
        }

        let classificacao = '';
        let repeticao = 0;
        for (let i = 0; i < nomeClasses.length; i++) {
            let repete = probabilidade.filter(function (x) { return x == nomeClasses[i] }).length;
            if (repete > repeticao) {
                repeticao = repete;
                classificacao = nomeClasses[i];
            }
        }
        console.log({ Class: classificacao });
        return classificacao;
    }


    // elimina os elementos duplicados
    async eliminaDuplicados(arr) {
        arr = [...new Set(arr)];
        return arr;
    }

    // retorna as classes existentes
    async retornaClasses() {
        let arr = classes;
        arr = await this.eliminaDuplicados(arr);
        return arr;
    }

    /*
        cria um json com as classes como chave
        e as entradas de cada classe como valor
    */
    async organizar() {
        let labels = await this.retornaClasses();
        let params = {};

        for (let i = 0; i < entradas.length; i++) {
            // separa as palavras com '-'
            let carac = '';
            if (i < (entradas.length - 1)) carac = '-';

            /*
                concatena as entradas de cada classe
                no valor da classe correspondente
    
                a quantidade de palavras repetidas por classe
                corresponde ao número de classes para a respectiva palavra
            */
            if (params[classes[i]]) {
                params[classes[i]] += entradas[i] + carac;
            } else {
                params[classes[i]] = entradas[i] + carac;
            }
        }

        // elimina a última vírgula de cada valor
        let str = JSON.stringify(params);
        str = str.replace(/-"/g, '"');
        str = str.replace(/-/g, ',');
        params = JSON.parse(str);

        return params;
    }

    // conta a quantidade de palavras repetidas em um texto
    async contaTexto(texto, procura) {
        return texto.split(procura).length - 1;
    }

    // monta um json com o número de classes para cada entrada
    async frequencia() {
        let categorias = [];
        let params = {};
        let objeto = await this.organizar();
        let labels = await this.retornaClasses();

        for (let i = 0; i < entradas.length; i++) {
            params['Entrada'] = entradas[i];

            for (let j = 0; j < labels.length; j++) {
                // conta o número de entradas em cada classe
                params[labels[j]] = await this.contaTexto(objeto[labels[j]], entradas[i]);
            }

            categorias[i] = JSON.stringify(params);
        }

        categorias = await this.eliminaDuplicados(categorias);

        for (let i = 0; i < categorias.length; i++) {
            categorias[i] = JSON.parse(categorias[i]);
        }

        return categorias;
    }

    // retorna a quantidade de classes
    async quantidadeClasses() {
        let categorias = await this.frequencia();
        // menos 1 para desconsiderar o valor da Entrada
        return parseInt(Object.keys(categorias[0]).length - 1);
    }

    // soma os valores das classes da entrada passada
    async somaClasses(arr) {
        let soma = 0;
        // inicia em 1 para desconsiderar o valor da Entrada
        for (let i = 1; i < arr.length; i++) {
            soma += parseInt(arr[i]);
        }
        return soma;
    }

    // retorna a soma total de cada classe
    async totalPorClasse() {
        let totalClasse = [];
        let nomeClasses = await this.retornaClasses();
        let str_classes = JSON.stringify(classes);

        for (let i = 0; i < nomeClasses.length; i++) {
            totalClasse[nomeClasses[i]] = await this.contaTexto(str_classes, nomeClasses[i]);
        }
        return totalClasse;
    }

    // soma dos totais de todas as classes
    async somaTotaisClasses() {
        return classes.length;
    }

    // pesos para as entradas
    async entradasPeso() {
        let pesos = [];
        let categorias = await this.frequencia();

        for (let i = 0; i < categorias.length; i++) {
            // Object.values(categorias[i]): retorna um vetor com os valores de cada chave
            pesos[categorias[i].Entrada] = await this.somaClasses(Object.values(categorias[i])) / await this.somaTotaisClasses();
        }
        return pesos;
    }

    // pesos para as classes
    async classesPeso() {
        let nomeClasses = await this.retornaClasses();
        let totalClasses = await this.totalPorClasse();

        let pesos = [];

        for (let i = 0; i < nomeClasses.length; i++) {
            pesos[nomeClasses[i]] = totalClasses[nomeClasses[i]] / await this.somaTotaisClasses();
        }
        return pesos;
    }

    // retorna a ocorrência de uma 'Classe' para uma 'Entrada'
    async ocorrenciaClasseParaEntrada(_entrada = '', _classe = '') {
        let categorias = await this.frequencia();
        let retorno = 0;

        await categorias.forEach(async (item) => {
            if (item['Entrada'] == _entrada) {
                retorno = parseInt(item[_classe]);
            }
        });
        return retorno;
    }

    // calcula a probabilidade da entrada pertencer a uma determinada classe
    async naiveBayes(_entrada = '') {
        let nomeClasses = await this.retornaClasses();
        let totalClasse = await this.totalPorClasse();

        // soma os resultados de todas as classes da 'Entrada' passada
        let categorias = await this.frequencia();
        let soma = 0;
        await categorias.forEach(async (item) => {
            if (item['Entrada'] == _entrada) {
                for (let i = 0; i < nomeClasses.length; i++) {
                    soma += parseInt(item[nomeClasses[i]]);
                }
            }
        });
        soma = tf.scalar(soma);

        let sumClass = tf.scalar( await this.somaTotaisClasses());
        let probabilidade = [];
        for (let i = 0; i < nomeClasses.length; i++) {
            let ocorrencia = tf.scalar(await this.ocorrenciaClasseParaEntrada(_entrada, nomeClasses[i]));
            let totalC = tf.scalar(totalClasse[nomeClasses[i]]);

            probabilidade[nomeClasses[i]] =
                ocorrencia.div(totalC).mul(totalC.div(sumClass)).div(soma.div(sumClass)).dataSync();
        }

        return probabilidade;
    }




}

module.exports = BayesService;