const express = require('express');
const MercadoPago = require('mercadopago');
const app = express();

///configurar o mercado pago
MercadoPago.configure({
    sandbox: true, // diz que esta em modo de desenvolvimento.
    access_token: "TEST-1461985823988370-081111-4e7e32dfd061b9a587274cc1c405afe8-234405831"
});

app.get('/', (req, res)=>{
    res.send('ola.');
});

var id = ""+Date.now()
var emailPagador = 'pcampa2011@hotmail.com'
app.get('/pagar', async (req, res)=>{
    var dados = {
        items: [
            item = {//Data ira retornar em minisegundos. tem que ser em string... por isso da conversao do id
                id: id,//o desenvolvedor que desenvolve esse id. Para cada pagamento é um id, dicas: UUID e data(),
                title:'2x video games, 3x camisas',//Descricao vc pode pegar no banco, ou pela pagina.
                quantity: 1,
                currency_id: 'BRL',//Moeda
                unit_price: parseFloat(150) //é o valor que o usuário ira pagar
            }
        ],
        //se trabalhar com banco é preciso salvar o id em algum lugar...
        // dica de dados na tabela: id/codigo/pagador/status/id dos usuario/cpf e etc
        //tipo tabela pagamento... 
        ////+++++++++++++++

        //pagador
        payer:{
            email: emailPagador
        },
        //campo consultado quando o pagamento é concluido
        external_reference: id
    }

    //Processo de pagamento
    try {
        var pagamento = await MercadoPago.preferences.create(dados);
        console.log(pagamento);
        //aki vc chamaria o banco e salvaria o id da compra e emil do pagador.
        return res.redirect(pagamento.body.init_point);

    } catch (error) {
        return res.send(error.message);
    }
   
});

app.post('/not', (req, res)=>{
    console.log(req.query);
    var id=  req.query.id;
    //Executar função e um determinado periodo de tempo.
    setTimeout(()=>{
        var filtro ={//documentação do mercado pago: busca de pagamento.
            "order.id": id
        }
        //eEssa função serve para buscar no mercado livre se o pagamento foi executado.
        MercadoPago.payment.search({
            qs: filtro
        }).then(data=>{
            console.log(data);
        }).catch(error =>{
            console.log(error);
        })
    },20000);
    res.send("OK"); // vc precisa enviar uma reposta para o mercado pago.
})

app.listen(80, (req, res)=>{
    console.log('servidor rodando.');
});