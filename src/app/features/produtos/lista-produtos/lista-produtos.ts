import { Component } from '@angular/core';
import { Produto } from '../produto/produto';
import { signal } from '@angular/core';
import {computed} from '@angular/core';
import {PrecoFormatadoPipe} from '../../../shared/pipes/preco-formatado-pipe';
import { effect } from '@angular/core'
import { UpperCasePipe } from '@angular/common';
@Component({
  selector: 'app-lista-produtos',
  imports: [Produto, PrecoFormatadoPipe,UpperCasePipe ],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.css',
})
export class ListaProdutos {
  //!lista de dados -Array de produtos com nome e preço
  produtos = signal( [
    {nome:'teclado Gamer', preco:229.99},
    {nome:'mouse Gamer', preco:300.99},
    {nome:'monitor', preco:207.99}
  ]);
  //!função para exibir produtos selecionados pelo usuário no controle
  exibirProduto(nome: string){
    console.log('Produto Selecionado: ', nome);
    this.produtoSelecionado.set(nome);
  }
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
    total + item.preco,0
  
  )}

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
  //! metodo para monitorar aiterações em tempo real usando effect()
  constructor(){
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
  produtoSelecionado = signal <string | null>(null);
  //! metodo para criar um estado para carrinho com signal
  carrinho = signal <{nome: string; preco: number}[]>([]);
  adicionarAoCarrinho(produto:{nome: string; preco: number}){
    this.carrinho.update(listaAtual => [...listaAtual, produto]
    );
  }
  //! totalprodutos = computed(() => this.produtos().length);
  //metodo para calcular a quantidade total de items no carrinho
  quantidadeCarrinho = computed(() => this.carrinho().length);
  //metodo para calcular o valor total dos itens do carrinho
  totalCarrinho = computed(() =>{
    return this.carrinho().reduce((total, item) => 
      total + item.preco,0)});
}

