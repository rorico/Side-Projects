using System;

class dkafldjaf
{
	static void Main()
	{
		int rewq = 0;
		string r;
		int qwer = 0;
		for ( int i = 10	; qwer<=10 ; i++)
		{
			int y = 1;
			if (prime(i))
			{
				y=0;
				string s = Convert.ToString(i);
				char[] a = s.ToCharArray();
				string w = "";
				for (int k = 0 ; k < a.Length ; k++)
				{
					w="";
					for ( int j = 0 ; j <=(a.Length-(1+k)) ; j++)
					{
						w+=a[j]+"";
						//Console.WriteLine(a[j]);
						
					}
					//Console.WriteLine(i +" "+w + "philrules");
					int x = int.Parse(w);
					if (prime(x)==false)
					{
						y=1;
					}
					//Console.WriteLine(s+" "+w);	
				}
				//Console.WriteLine();
				w = "";
				for (int k = 1 ; k < a.Length ; k++)
				{
					w = "";
					for ( int j = a.Length-(1+k) ; j >=0 ; j--)
					{
						w+=a[a.Length-(1+j)]+"";
						
					}
					int x = int.Parse(w);
					if (prime(x)==false)
					{
						y=1;
						//Console.WriteLine(i+" "+ x);
					}
					//Console.WriteLine(s	+" "+w);
				}
				//Console.WriteLine();
			}
			if (y==0)
			{
				qwer++;
				rewq+=i;
				Console.WriteLine(i);
			}
			
		}
		Console.WriteLine(rewq);
	}
	static bool prime(int x)
	{
		if (x<2)
		{
			return false;
		}
		for(int i = 2; i<= (int)Math.Sqrt(x) ; i++)
		{
			if (x%i==0)
			{
				return false;
			}
		}
		return true;
	}
}