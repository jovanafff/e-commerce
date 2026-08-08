import { Component } from '@angular/core';
import { Produto } from '../produto/produto';
import { signal } from '@angular/core';
import {computed} from '@angular/core';
import {PrecoFormatadoPipe} from '../../../shared/pipes/preco-formatado-pipe';
import { effect } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { produtosService } from '../../../core/services/produtos service';
import { inject } from '@angular/core';
import { CarrinhoService } from '../../../core/services/carrinho.service';

@Component({
  selector: 'app-lista-produtos',
  imports: [Produto, PrecoFormatadoPipe,UpperCasePipe ],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.css',
})
export class ListaProdutos {
//!lista de dados -Array de produtos com nome e preço
  produtos = signal<{nome: string; preco: number}[]>([]);
  carregando = signal(true);
  produtoSelecionado = signal<string | null>(null);
  erro = signal <string | null>(null);

  //!função para exibir produtos selecionados pelo usuário no controle
  exibirProduto(nome: string){
    console.log('Produto Selecionado: ', nome);
    this.produtoSelecionado.set(nome);
  }
 
//** ==================== INJECT =======================

    private produtosService = inject(produtosService);
    public carrinhoService = inject(CarrinhoService);

    quantidadeCarrinho = this.carrinhoService.quantidadeItens;
    totalCarrinho = this.carrinhoService.totalItens;

  //!função que adicionar produto usando metodo update()
  adicionarProduto(){
    this.produtos.update(listaAtual =>[
...listaAtual,
{nome:'Playstation 5', preco:3000},
    ]);
  }

  //!função que contabiliza a quantidade de produtos na lista com metodo computed()
  totalProdutos = computed(() => this.produtos().length);
  //!função que calcula o valor total do protudos usando metodo computed()

  valorTotal = computed(() =>
  {return this.produtos().reduce((total, item) =>
    total + item.preco,0 )}
  );
  //função para substituir a lista atual usando o metodo ser()
  substituirProdutos(){
    this.produtos.set([
      {nome:'Teclado' , preco: 50 },
      {nome:'Mouse' , preco: 15 },
      {nome:'Monitor' , preco: 500 },
      {nome:'Desktop' , preco: 1500 },
      {nome:'headset' , preco: 30 },
    ]);
  }

  carregarProdutos(){
this.erro.set(null);
this.carregando.set(true);
this.produtosService.buscarProdutos().subscribe({
  next:(dados) => {
    const produtos = this.produtosService.transFormarProdutos(dados);
    this.produtos.set(produtos);
    this.carregando.set(false);
  },
  error: (erro) => {
    console.error('erro ao carregar produtos:',erro);
    this.erro.set('erro ao carregar o serviço');
    this.carregando.set(false);
  }
});
   }
 //! metodo para monitorar aiterações em tempo real usando effect()
  constructor(){
    //! Carrega a API
    this.carregarProdutos();

    //! effect continuam iguais - não mexer
    effect(() => {
      console.log('Lista de Produtos Alterados', this.produtos());
    });
     effect(() => {
      console.log('Valor Total Atualizado:', this.valorTotal());
     });
      effect(() => {
        if (typeof document !== 'undefined'){
          document.title = `(${this.totalProdutos()}) - Loja da jojo`;
        }
      }); 
  }
 //! Metodo para criar um estado de seleção com signal string | null
  produtoselecionado = signal <string | null>(null);
  //! metodo para criar um estado para carrinho com signal
  
  adicionarAoCarrinho(produto:{nome: string; preco: number}){
    this.carrinhoService.adicionar(produto);
  }
  
}  

  








 
 



