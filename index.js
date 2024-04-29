const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    database: 'harrypotter',
    host: 'localhost',
    password: 'ds564',
    port: 7007
});

//wizards

app.get('/wizards', async (req, res) => {
    try {
        const wizards = await pool.query('SELECT * FROM wizard;');
        res.json({
            total: wizards.rowCount,
            wizards: wizards.rows
        });
    } catch (e) {
        console.error('Erro ao obter todos os bruxos', e);
        res.status(500).send({ mensagem: 'Erro ao obter todos os bruxos' });
    }
});


app.get('/wizards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const wizard = await pool.query('SELECT * FROM wizard WHERE id=$1', [id]);

        if (wizard.rowCount === 0) {
            res.status(404).send({ message: 'Bruxo não encontrado' });
        } else {
            res.json(wizard.rows[0]);
        }

    } catch (e) {
        console.error('Erro ao obter bruxo', e);
        res.status(500).send({ mensagem: `Erro ao obter bruxo com id: ${id}` });
    }
});

//variaveis de validação
const houses = ['Grifinoria', 'Sonserina', 'Lufa-Lufa', 'Corvinal'];
const typesblood = ['Puro', 'Mestiço', 'Trouxa'];

app.post('/wizards', async (req, res) => {
    try {
        let { name, house, hability, bloodstatus, patron } = req.body;

        patron ? patron : patron = 'Este bruxo ainda não possui patrono';

        if(!name || !house || !hability || !bloodstatus) {
            res.status(404).send({ message: 'Preencha todos os campos' });
        } else if(!houses.includes(house)) {
            res.status(400).send({ message: 'Casa incorreta, opções disponiveis: Grifinória, Sonserina, Corvinal, Lufa-Lufa' });
        } else if(!typesblood.includes(bloodstatus)) {
            res.status(400).send({ message: 'Sangue incorreto, opções disponiveis: Mestiço, Puro, Trouxa' });
        } else {
            await pool.query('INSERT INTO wizard (name, house, hability, bloodstatus, patron) VALUES ($1, $2, $3, $4, $5);',
            [name, house, hability, bloodstatus, patron]);
            res.status(201).send({ message: 'Bruxo cadastrado com sucesso' });
        }
    } catch (e) {
        console.error('Erro ao criar bruxo', e);
        res.status(500).send({ mensagem: 'Não foi possível cadastrar bruxo' });
    }
});

app.put('/wizards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let { name, house, hability, bloodstatus, patron } = req.body;

        patron ? patron : patron = 'Este bruxo ainda não possui patrono';

        if(!name || !house || !hability || !bloodstatus) {
            res.status(404).send({ message: 'Preencha todos os campos' });
        } else if(!houses.includes(house)) {
            res.status(400).send({ message: 'Casa incorreta, opções disponiveis: Grifinória, Sonserina, Corvinal, Lufa-Lufa' });
        } else if(!typesblood.includes(bloodstatus)) {
            res.status(400).send({ message: 'Sangue incorreto, opções disponiveis: Mestiço, Puro, Trouxa' });
        } else {
            await pool.query('UPDATE wizard SET name=$1, house=$2, hability=$3, bloodstatus=$4, patron=$5 WHERE id=$6',
            [name, house, hability, bloodstatus, patron, id]);
            res.status(201).send({ message: `Dados do bruxo com id:${id} alterados com sucesso` });
        }
        
    } catch (e) {
        console.error('Erro ao editar bruxo', e);
        res.status(500).send({ mensagem: 'Não foi possível editar bruxo' });
    }
});

app.delete('/wizards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM wizard WHERE id=$1', [id]);
        res.status(200).send({ message: `Bruxo com id:${id}, deletado com sucesso` });
    } catch (e) {
        console.error('Erro ao excluir bruxo', e);
        res.status(500).send({ mensagem: 'Não foi possível excluir bruxo' });
    }
});

app.get('/wizards/name/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await pool.query('SELECT * FROM wizard WHERE name LIKE $1', [`${name}%`]);
        if(result.rowCount == 0) {
            return res.status(404).json('Nenhum bruxo encontrado com este nome');
        } else {
            res.json(result.rows[0]);
        }
    } catch(e) {
        console.error('Erro ao encontrar bruxo', e);
        res.status(500).send({ mensagem: 'Não foi possível encontrar bruxo' });
    }
});

//wands

app.get('/wands', async (req, res) => {
    try {
        const wands = await pool.query('SELECT * FROM wands;');
        res.json({
            total: wands.rowCount,
            wands: wands.rows
        });
    } catch (e) {
        console.error('Erro ao obter todas as varinhas', e);
        res.status(500).send({ mensagem: 'Erro ao obter todas as varinhas' });
    }
});


app.get('/wands/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const wands = await pool.query('SELECT * FROM wands WHERE id=$1', [id]);

        if (wands.rowCount === 0) {
            res.status(404).send({ message: 'Varinha não encontrado' });
        } else {
            res.json(wands.rows[0]);
        }

    } catch (e) {
        console.error('Erro ao obter varinha', e);
        res.status(500).send({ mensagem: `Erro ao obter varinha com id: ${id}` });
    }
});

const typescore = ['Fenix', 'Unicornio', 'Vela', 'Fibra de coração de dragão']

app.post('/wands', async (req, res) => {
    try {
        const { material, long, core, manufacturingdate } = req.body;

        if(!material|| !long || !core || !manufacturingdate) {
            res.status(404).send({ message: 'Preencha todos os campos' });
        } else if(!typescore.includes(core)) {
            res.status(400).send({ message: 'Núcleo incorreto, opções: Fenix, Unicornio, Vela, Fibra de coração de dragão' });
        } else if(long < 15 || long > 45) {
            res.status(400).send({ message: 'Tamanho inválido, escolher entre 15 e 45 centimetros' });
        } else {
            await pool.query('INSERT INTO wands (material, long, core, manufacturingdate) VALUES ($1, $2, $3, $4);',
            [material, long, core, manufacturingdate]);

            res.status(201).send({ message: 'Varinha cadastrado com sucesso' });
        }
    } catch (e) {
        console.error('Erro ao criar bruxo', e);
        res.status(500).send({ mensagem: 'Não foi possível cadastrar varinha' });
    }
});

app.put('/wands/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { material, long, core, manufacturingdate } = req.body;
        
        if(!material|| !long || !core || !manufacturingdate) {
            res.status(404).send({ message: 'Preencha todos os campos' });
        } else if(!typescore.includes(core)) {
            res.status(400).send({ message: 'Núcleo incorreto, opções: Fenix, Unicornio, Vela, Fibra de coração de dragão' });
        } else if(long < 15 || long > 45) {
            res.status(400).send({ message: 'Tamanho inválido, escolher entre 15 e 45 centimetros' });
        } else {
            await pool.query('UPDATE wands SET material=$1, long=$2, core=$3, manufacturingdate=$4 WHERE id=$5',
            [material, long, core, manufacturingdate, id]);

            res.status(201).send({ message: `Dados do Varinha com id:${id} alterados com sucesso` });
        }
    } catch (e) {
        console.error('Erro ao editar Varinha', e);
        res.status(500).send({ mensagem: 'Não foi possível editar varinha' });
    }
});

app.delete('/wands/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM wands WHERE id=$1', [id]);
        res.status(200).send({ message: `Varinha com id:${id}, deletado com sucesso` });
    } catch (e) {
        console.error('Erro ao excluir varinha', e);
        res.status(500).send({ mensagem: 'Não foi possível excluir varinha' });
    }
});

app.get('/wands/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const result = await pool.query('SELECT * FROM wands WHERE manufacturingdate LIKE $1', [`${date}%`]);
        if(result.rowCount == 0) {
            return res.status(404).json('Nenhuma varinha fabricada nesta data');
        } else {
            res.json(result.rows[0]);
        }
    } catch(e) {
        console.error('Erro ao encontrar varinha', e);
        res.status(500).send({ mensagem: 'Não foi possível encontrar varinha desta data' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
})