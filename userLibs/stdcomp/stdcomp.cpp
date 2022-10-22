#include "stdcomp.h"

// Not
Not::Not()
{
    in_o = 1;
    o = &in_o;
}
void Not::wire()
{
}
void Not::process()
{
    in_o = !(*a);
}
// CtrlInverter
CtrlInverter::CtrlInverter()
{
    in_o = 0;
    o = &in_o;
}
void CtrlInverter::wire()
{
}
void CtrlInverter::process()
{
    in_o = (*c)?(!(*a)):0;
}

// Buffer
Buffer::Buffer()
{
    in_o = 0;
    o = &in_o;
}
void Buffer::wire()
{
}
void Buffer::process()
{
    in_o = (*a);
}

// CtrlBuffer
CtrlBuffer::CtrlBuffer()
{
    in_o = 0;
    o = &in_o;
}
void CtrlBuffer::wire()
{
}
void CtrlBuffer::process()
{
    in_o = (*c)?(*a):0;
}

// And
And2::And2()
{   
    in_o = 0;
    o = &in_o;               
}
void And2::wire()
{    
}    
void And2::process()
{
    in_o = ((*a)&&(*b));
}
 
And3::And3()
{
    in_o = 0;
    o = &in_o;               
}
void And3::wire()
{       
}    
void And3::process()
{
    in_o = ((*a)&&(*b)&&(*c));
}

And4::And4()
{
    in_o = 0;
    o = &in_o;               
}
void And4::wire()
{       
}    
void And4::process()
{
    in_o = ((*a)&&(*b)&&(*c)&&(*d));
}

// OR

Or2::Or2()
{   
    in_o = 0;
    o = &in_o;               
}
void Or2::wire()
{    
}    
void Or2::process()
{
    in_o = ((*a)||(*b));
}
 
Or3::Or3()
{
    in_o = 0;
    o = &in_o;               
}
void Or3::wire()
{       
}    
void Or3::process()
{
    in_o = ((*a)||(*b)||(*c));
}

Or4::Or4()
{
    in_o = 0;
    o = &in_o;               
}
void Or4::wire()
{       
}    
void Or4::process()
{
    in_o = ((*a)||(*b)||(*c)||(*d));
}

//Nor
Nor2::Nor2()
{   
    in_o = 0;
    o = &in_o;               
}
void Nor2::wire()
{    
}    
void Nor2::process()
{
    in_o = !((*a)||(*b));
}
 
Nor3::Nor3()
{
    in_o = 0;
    o = &in_o;               
}
void Nor3::wire()
{       
}    
void Nor3::process()
{
    in_o = !((*a)||(*b)||(*c));
}

 
Nor4::Nor4()
{
    in_o = 0;
    o = &in_o;               
}
void Nor4::wire()
{       
}    
void Nor4::process()
{
    in_o = !((*a)||(*b)||(*c)||(*d));
}



// Nand
Nand2::Nand2()
{   
    in_o = 0;
    o = &in_o;               
}
void Nand2::wire()
{    
}    
void Nand2::process()
{
    in_o = !((*a)&&(*b));
}
 
Nand3::Nand3()
{
    in_o = 0;
        o = &in_o;               
}
void Nand3::wire()
{       
}    
void Nand3::process()
{
    in_o = !((*a)&&(*b)&&(*c));
}

 
Nand4::Nand4()
{
    in_o = 0;
    o = &in_o;               
}
void Nand4::wire()
{       
}    
void Nand4::process()
{
    in_o = !((*a)&&(*b)&&(*c)&&(*d));
}

// XOR

Xor2::Xor2()
{   
    in_o = 0;
    o = &in_o;               
}
void Xor2::wire()
{    
}    
void Xor2::process()
{
    in_o = ((*a)^(*b));
}
 
Xor3::Xor3()
{
    in_o = 0;
    o = &in_o;               
}
void Xor3::wire()
{       
}    
void Xor3::process()
{
    in_o = ((*a)^(*b)^(*c));
}

 
Xor4::Xor4()
{
    in_o = 0;
    o = &in_o;               
}
void Xor4::wire()
{       
}    
void Xor4::process()
{
    in_o = ((*a)^(*b)^(*c)^(*d));
}


// XNOR

Xnor2::Xnor2()
{   
    in_o = 0;
    o = &in_o;               
}
void Xnor2::wire()
{    
}    
void Xnor2::process()
{
    in_o = !((*a)^(*b));
}
 
Xnor3::Xnor3()
{
    in_o = 0;
    o = &in_o;               
}
void Xnor3::wire()
{       
}    
void Xnor3::process()
{
    in_o = !((*a)^(*b)^(*c));
}

 
Xnor4::Xnor4()
{
    in_o = 0;
    o = &in_o;               
}
void Xnor4::wire()
{       
}    
void Xnor4::process()
{
    in_o = !((*a)^(*b)^(*c)^(*d));
}



// Positive Trigger
    
PosTrig::PosTrig()
{   
    t = 0;
    in_o = 0;
    o = &in_o;
    c = upp;
}
void PosTrig::wire()
{    
}
void PosTrig::process()
{
    c--;
    if(c==0)
    {        
        if((t == 0)&&(*i == 1)){            
            in_o = 1; 
        }else{
           in_o = 0;  
        }
        t = *i;
        c = upp;
    }   
}


// Negative Trigger
NegTrig::NegTrig()
{   
    t = 0;
    in_o = 0;
    o = &in_o;
    c = upp;
}
void NegTrig::wire()
{
    
    
}
void NegTrig::process()
{
    c--;
    if(c==0)
    {        
        if((t == 1)&&(*i == 0)){            
            in_o = 1; 
        }else{
           in_o = 0;  
        }
        t = *i;
        c = upp;
    }    
}


// Odd Parity
// Even Parity