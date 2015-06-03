using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		int i = 4;
		//int[] i = new int[100];
		//i[12] = 1;
		int blue = 15;
		//int test = 0;
		bool check = true;
		while(check)
		{
			blue = (int) Math.Sqrt(i*(i-1)/2);
			for( ; blue < i ; blue++ )
			{
				if((i*(i-1)) == 2 * (blue*(blue-1)))
				{
				//Console.WriteLine(i + " " + blue + " " + (i-1) + " " + (blue-1));
				p(i);
				Console.WriteLine();
				p(i-1);
				Console.WriteLine();
				p(blue);
				Console.WriteLine();
				p(blue-1);
				Console.WriteLine();
				//check = false;
				break;
				}
			}
			//increment(i);
			i++;
		}
		/*//int[] i = new int[100];
		Number i = new Number("1000000000000");
		//i[0] = 4;
		//int[] blue = new int[100];
		Number blue = new Number(4);
		Number tnp = new Number(blue.write());
		Number tnp2 = new Number(i.write());
		Number tnp3 = new Number(blue.write());
		tnp3.decrement();
		Number tnp4 = new Number(i.write());
		bool check = true;
		while(check)
		{
			blue.e(i);
			blue.half();
			
			while(blue.compare(i))
			{
				tnp.equate(blue);
				tnp2.equate(i);
				tnp3.equate(blue);
				tnp4.equate(i);
				tnp3.decrement();
				tnp4.decrement();
				tnp.multiply(tnp3);
				tnp2.multiply(tnp4);
				tnp.multiply(2);
				//Console.WriteLine(tnp.write());
				//Console.WriteLine(tnp2.write());
				if(tnp.write() == tnp2.write())
				{
				Console.WriteLine(i.write() + " " + blue.write());
				check = false;
				break;
				}
				Console.WriteLine(i.write() + " " + blue.write());
				blue.increment();
			}
			i.increment();
			//Console.WriteLine(i.write() + " " + blue.write());
		}*/
		/*Number i = new Number("1000000000000");
		Number blue = new Number(4);
		Number tnp = new Number(blue.write());
		Number tnp2 = new Number(i.write());
		Number tnp3 = new Number(blue.write());
		Number tnp4 = new Number(i.write());
		bool check = true;
		while(check)
		{
			blue.equate(i);
			blue.multiply(100000000);
			blue.divide(141421357);
			
				tnp.equate(blue);
				tnp3.equate(blue);
				tnp3.decrement();
				tnp.multiply(tnp3);
				tnp.multiply(2);
				tnp2.equate(i);
				tnp4.equate(i);
				tnp4.decrement();
				tnp2.multiply(tnp4);
			
			while(tnp.compare(tnp2))
			{
				tnp.equate(blue);
				tnp3.equate(blue);
				tnp3.decrement();
				tnp.multiply(tnp3);
				tnp.multiply(2);
				//Console.WriteLine(tnp.write());
				//Console.WriteLine(tnp2.write());
				if(tnp.write() == tnp2.write())
				{
				Console.WriteLine(i.write() + " " + blue.write());
				check = false;
				break;
				}
				//Console.WriteLine(i.write() + " " + blue.write());
				blue.increment();
			}
			i.increment();
			Console.WriteLine(i.write() + " " + blue.write());
		}*/
	}	
	static void p(int x){
		for (int i = 2 ; x!=1 ; i++)
		{
			if (x%i==0){
				x/=i;
				Console.Write(" "+i);
				i--;
			}
		}
	}
	static void f(int x){
		for (int i = 1; i<x ; i++)
		{
			if (x%i==0){
				Console.Write(" "+i);
			}
		}
	}
	/*static void create( int x , int[] a) //creates number
	{
		string s = Convert.ToString(x);
		for ( int i = s.Length-1 ; i>=0 ; i--)
		{
			a[i] = (int) Char.GetNumericValue(s[s.Length-1-i]);
		}
		for ( int i = s.Length ; i<a.Length ; i++)
		{
			a[i] = 0 ;
		}
	}
	static void add( int[] x , int[] y) //add numbers
	{
		for ( int i = x.Length-1 ; i>=0 ; i--)
		{
			x[i] += y[i];
			a(x,i);
		}
	}
	static void multiply( int[] x , int y) //multiply
	{
		for ( int i = x.Length-1 ; i>=0 ; i-- )
		{
			x[i]=x[i]*y;
			a(x,i);
		}
	}
	static void multiply_array( int[] x , int[] y) //multiply
	{
		int[] tnp = new int[y.Length];
		for ( int i = x.Length-1 ; i>=0 ; i-- )
		{
			e(tnp,y);
			multiply(tnp,x[i]);
			x[i]=0;
			for ( int j = tnp.Length-1 ; j>=0 ; j--)
			{
				if(tnp[j]==0)
				{
					continue;
				}
				x[j+i] += tnp[j];
				a(x,j+i);
			}
			a(x,i);
		}
	}
	static void a( int[] x , int y ) //converts number>10 to proper
	{
		string s = Convert.ToString(x[y]);
		x[y] = x[y]%10;
		for ( int i = 1 ; i < s.Length; i++)
		{
			x[y+i] = x[y+i]+ (int) Char.GetNumericValue(s[s.Length-1-i]);
			d(x,y+i);
		}
	}
	static void d( int[] x , int y ) // helps a() with carrying
	{
		if ( x[y] >= 10 )
		{
			x[y+1] = x[y+1] + x[y]/10;
			x[y] = x[y]%10;
			y++;
			d(x,y);
		}
	}
	static string write( int[]x ) //write out array
	{
		string number = "";
		int check = 0;
		for ( int i = x.Length-1 ; i>=0 ; i-- )
		{
			if(check==0&&x[i]!=0)
			{
				check++;
				number += x[i].ToString();
			} else if (check!=0) {
				number += x[i].ToString();
			}
		}
		return number;
	}
	static void e( int[] x , int[] z ) //make x = z
	{
		for ( int i = x.Length-1 ; i>=0 ; i-- )
		{
			x[i] = z[i];
		}
	}
	static void increment( int[] x ) //increment
	{
		x[0]++;
		d(x,0);
	}
	static void oi( int[] x ) //subtract one
	{
		if(x[0]!=0){
			int tnp = x[0]--;
		} else {
			x[0] = 9;
			oa(x,1);
		}
		
	}
	static void oa( int[] x , int z) //help oi
	{
		
		if(x[z]!=0){
			int tnp = x[z]--;
		} else {
			x[z] = 9;
			oa(x,z+1);
		}
	}
	static void half( int[] x ) //half
	{
		for ( int i = 0 ; i<x.Length ; i++ )
		{
			int tnp = x[i];
			if( tnp % 2 = 1 && i != 0)
			{
				x[i] = tnp/2;
				x[i-1]+=5;
			} else {
				x[i] = tnp/2;
			}
		}
		for ( int i = x.Length-1 ; i>=0 ; i-- )
		{
			a(x,i);
		}
	}*/
}
class Number
{
	public int[] number = new int[25];
	public Number( int x )
	{
		string s = Convert.ToString(x);
		for ( int i = s.Length-1 ; i>=0 ; i--)
		{
			number[i] = (int) Char.GetNumericValue(s[s.Length-1-i]);
		}
		for ( int i = s.Length ; i<number.Length ; i++)
		{
			number[i] = 0 ;
		}
	}
	public Number( string s )
	{
		for ( int i = s.Length-1 ; i>=0 ; i--)
		{
			number[i] = (int) Char.GetNumericValue(s[s.Length-1-i]);
		}
		for ( int i = s.Length ; i<number.Length ; i++)
		{
			number[i] = 0 ;
		}
	}
	public void add( Number y ) //add numbers
	{
		for ( int i = number.Length-1 ; i>=0 ; i--)
		{
			number[i] += y.number[i];
			a(i);
		}
	}
	public void multiply( int y) //multiply
	{
		for ( int i = number.Length-1 ; i>=0 ; i-- )
		{
			number[i]*=y;
			a(i);
		}
	}
	public void multiply( Number y ) //multiply
	{
		Number tnp = new Number(y.write());
		for ( int i = number.Length-1 ; i>=0 ; i-- )
		{
			Array.Copy(y.number,tnp.number,y.number.Length);
			tnp.multiply(number[i]);
			number[i]=0;
			for ( int j = tnp.number.Length-1 ; j>=0 ; j--)
			{
				if(tnp.number[j]==0)
				{
					continue;
				}
				number[j+i] += tnp.number[j];
				a(j+i);
			}
		}
	}
	public void a( int y ) //converts number>10 to proper
	{
		string s = Convert.ToString(number[y]);
		number[y] = number[y]%10;
		for ( int i = 1 ; i < s.Length; i++)
		{
			number[y+i] = number[y+i]+ (int) Char.GetNumericValue(s[s.Length-1-i]);
			carry(y+i);
		}
	}
	public void carry( int y ) // helps a() with carrying
	{
		if ( number[y] >= 10 )
		{
			number[y+1] = number[y+1] + number[y]/10;
			number[y] = number[y]%10;
			y++;
			carry(y);
		}
	}
	public string write() //return number as string
	{
		string str = "";
		int check = 0;
		for ( int i = number.Length-1 ; i>=0 ; i-- )
		{
			if(check==0&&number[i]!=0)
			{
				check++;
				str += number[i].ToString();
			} else if (check!=0) {
				str += number[i].ToString();
			}
		}
		return str;
	}
	public void equate( Number z ) //make this = z
	{
		Array.Copy(z.number,number,z.number.Length);
	}
	public void increment() //increment
	{
		number[0]++;
		carry(0);
	}
	public void decrement() //subtract one
	{
		if(number[0]!=0){
			int tnp = number[0]--;
		} else {
			number[0] = 9;
			oa(1);
		}
		
	}
	public void oa( int z ) //help oi
	{
		
		if(number[z]!=0){
			int tnp = number[z]--;
		} else {
			number[z] = 9;
			oa(z+1);
		}
	}
	public void half() //half
	{
		for ( int i = 0 ; i<number.Length ; i++ )
		{
			int tnp = number[i];
			if( tnp % 2 == 1 && i != 0)
			{
				number[i] = tnp/2;
				number[i-1]+=5;
			} else {
				number[i] = tnp/2;
			}
		}
		for ( int i = number.Length-1 ; i>=0 ; i-- )
		{
			a(i);
		}
	}
	public bool compare( Number z ) //z greater or equal
	{	
		int[] tnp = z.number;
		for ( int i = number.Length-1 ; i>=0 ; i-- )
		{
			if(number[i]<tnp[i]){
				return true;
			} else if (number[i]>tnp[i]) { 
				return false;
			}
		}
		return true;
	}
	public void divide() //divide by 1000
	{
		for ( int i = 3 ; i<number.Length ; i++ )
		{
			number[i-3]=number[i];
		}
	}
	public void divide(int divider) //divide by 1000
	{
		int numerator = 0;
		for ( int i = number.Length-1 ; i>=0 ; i-- )
		{
			numerator = numerator*10 + number[i];
			number[i] = numerator/divider;
			numerator -= divider*number[i];
		}
	}
}