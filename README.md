# APP 

GymPass style app


## RFs (Requisitos Funcionais) => Funcionalidades da aplicação, o que vai ser possível fazer

 - [x] Deve ser possível se cadastrar 
 - [x] Deve ser possivel se autenticar
 - [ ] Deve ser possível obter o perfil de um usuário logado 
 - [ ] Deve ser possível o número de check-ins realizados pelo usuário logado
 - [ ] Deve ser possível o usuário obter seu histórico de check-ins 
 - [ ] Deve ser possível o usuário buscar academias próximas
 - [ ] Deve ser possível o usuário buscar academias pelo nome 
 - [ ] Deve ser possível o usuário realizar check-in em uma cademia
 - [ ] Deve ser possível validar o check-in de um usuário
 - [ ] Deve ser possível cadastrar uma academia

## RNs (Regras de negócios) => caminhos que o requisito deve seguir

 - [x] O usuário não deve poder se cadastrar com um email duplicado
 - [ ] O usuário não pode fazer 2 check-ins no mesmo dia 
 - [ ] O usuário não pode fazer checkin se não estiver perto  (100) da academia
 - [ ] O checkin só pode ser validado até 20 min após criado
 - [ ] O checkin só pode ser validado por administradores 
 - [ ] A academia só pode ser cadastrada por administradores 

## RNFs (Requisitos não funcionais) => Não partem do clientec 

 - [x] A senha do usuário precisa estar criptografada 
 - [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL 
 - [ ] Todas as listas de dados precisam estar páginadas com 20 itens por página
 - [ ] O usuário deve ser identificado por um JWT 