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
        let nomeClasses = await this.retornaClasses();
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


    async eliminaDuplicados(arr) {
        arr = [...new Set(arr)];
        return arr;
    }

    async retornaClasses() {
        let arr = classes;
        arr = await this.eliminaDuplicados(arr);
        return arr;
    }


    async organizar() {
        let labels = await this.retornaClasses();
        let params = {};

        for (let i = 0; i < entradas.length; i++) {
            let carac = '';
            if (i < (entradas.length - 1)) carac = '-';


            if (params[classes[i]]) {
                params[classes[i]] += entradas[i] + carac;
            } else {
                params[classes[i]] = entradas[i] + carac;
            }
        }

        let str = JSON.stringify(params);
        str = str.replace(/-"/g, '"');
        str = str.replace(/-/g, ',');
        params = JSON.parse(str);

        return params;
    }

    async contaTexto(texto, procura) {
        return texto.split(procura).length - 1;
    }

    async frequencia() {
        let categorias = [];
        let params = {};
        let objeto = await this.organizar();
        let labels = await this.retornaClasses();

        for (let i = 0; i < entradas.length; i++) {
            params['Entrada'] = entradas[i];

            for (let j = 0; j < labels.length; j++) {
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

    async quantidadeClasses() {
        let categorias = await this.frequencia();
        return parseInt(Object.keys(categorias[0]).length - 1);
    }

    async somaClasses(arr) {
        let soma = 0;
        for (let i = 1; i < arr.length; i++) {
            soma += parseInt(arr[i]);
        }
        return soma;
    }

    async totalPorClasse() {
        let totalClasse = [];
        let nomeClasses = await this.retornaClasses();
        let str_classes = JSON.stringify(classes);

        for (let i = 0; i < nomeClasses.length; i++) {
            totalClasse[nomeClasses[i]] = await this.contaTexto(str_classes, nomeClasses[i]);
        }
        return totalClasse;
    }

    async somaTotaisClasses() {
        return classes.length;
    }

    async entradasPeso() {
        let pesos = [];
        let categorias = await this.frequencia();

        for (let i = 0; i < categorias.length; i++) {
            pesos[categorias[i].Entrada] = await this.somaClasses(Object.values(categorias[i])) / await this.somaTotaisClasses();
        }
        return pesos;
    }

    async classesPeso() {
        let nomeClasses = await this.retornaClasses();
        let totalClasses = await this.totalPorClasse();

        let pesos = [];

        for (let i = 0; i < nomeClasses.length; i++) {
            pesos[nomeClasses[i]] = totalClasses[nomeClasses[i]] / await this.somaTotaisClasses();
        }
        return pesos;
    }

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

    async naiveBayes(_entrada = '') {
        let nomeClasses = await this.retornaClasses();
        let totalClasse = await this.totalPorClasse();

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

        let sumClass = tf.scalar(await this.somaTotaisClasses());
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