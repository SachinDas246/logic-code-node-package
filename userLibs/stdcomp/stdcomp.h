#ifndef STDCOMP_H
#define STDCOMP_H


extern int upp;

// Not
class Not{
    public:
    //output
    bool *o;
    //input
    bool *a;

    bool in_o;
    Not();
    void wire();
    void process();

};

// Controlled Inverter
class CtrlInverter{
    public:
    //output
    bool *o;
    //input
    bool *a;
    bool *c;

    bool in_o;
    CtrlInverter();
    void wire();
    void process();
};

// Buffer
class Buffer{
    public:
    //output
    bool *o;
    //input
    bool *a;

    bool in_o;
    Buffer();
    void wire();
    void process();

};



// Controlled Buffer
class CtrlBuffer{
    public:
    //output
    bool *o;
    //input
    bool *a;
    bool *c;

    bool in_o;
    CtrlBuffer();
    void wire();
    void process();

};

// And
class And2
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    
    bool in_o;
    And2();   
    void wire();   
    void process();   
};

class And3
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    
    bool in_o;
    And3();   
    void wire();   
    void process();   
};

class And4
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    bool *d;
    
    bool in_o;
    And4();   
    void wire();   
    void process();   
};

// Or
class Or2
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    
    bool in_o;
    Or2();   
    void wire();   
    void process();   
};

class Or3
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    
    bool in_o;
    Or3();   
    void wire();   
    void process();   
};

class Or4
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    bool *d;
    
    bool in_o;
    Or4();   
    void wire();   
    void process();   
};


// Nand
class Nand2
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    
    bool in_o;
    Nand2();   
    void wire();   
    void process();   
};
class Nand3
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    
    bool in_o;
    Nand3();  
    void wire();
    void process();    
};
class Nand4
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    bool *d;
    
    bool in_o;
    Nand4();
    void wire();    
    void process();
};

// Nor
class Nor2
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    
    bool in_o;
    Nor2();   
    void wire();   
    void process();   
};
class Nor3
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    
    bool in_o;
    Nor3();  
    void wire();
    void process();    
};
class Nor4
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    bool *d;
    
    bool in_o;
    Nor4();
    void wire();    
    void process();
};

// XOR
class Xor2
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    
    bool in_o;
    Xor2();   
    void wire();   
    void process();   
};
class Xor3
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    
    bool in_o;
    Xor3();  
    void wire();
    void process();    
};
class Xor4
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    bool *d;
    
    bool in_o;
    Xor4();
    void wire();    
    void process();
};


// XNOR

class Xnor2
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    
    bool in_o;
    Xnor2();   
    void wire();   
    void process();   
};
class Xnor3
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    
    bool in_o;
    Xnor3();  
    void wire();
    void process();    
};
class Xnor4
{   
    public:
    //outputs
    bool *o;
    //inputs
    bool *a;
    bool *b;
    bool *c;
    bool *d;
    
    bool in_o;
    Xnor4();
    void wire();    
    void process();
};



// Odd Parity
// Even Parity



class PosTrig
{
    public:
    //output
    bool *o;
    //input
    bool *i;

    bool in_o;
    bool t;
    int c;
    PosTrig();
    void wire();
    void process();
};

class NegTrig
{
    public:
    //output
    bool *o;
    //input
    bool *i;
    
    bool in_o;
    bool t;
    int c;
    NegTrig();
    void wire();
    void process();
};

#endif