using System;

class dkafldjaf
{
	static void Main()
	{
		int[] primes;
		double result = 0;
		double test = 15499/((double)94744);
		//double test = 4.0/10;
		int num = 0;
		bool devides = true;
		bool check = true;
		int[] primes2 = new int[1000];
		int cnt = 0;
		for ( int i = 2 ; i< 1000 ; i++ )
		{
			if(prime(i))
			{	
				primes2[cnt] = i;
				cnt++;
			}
		}
		cnt = 0;
		int bases = 1;
		int current = bases;
		for ( int i = 2 ; check ; i++ )
		{
			if(!(i==primes2[cnt]))
			{
				continue;
			}
			
			for ( int k = 2 ; k<=i ; k++ )
			{
				current = bases * k;
				num = 0;
				primes = p(current);
				//Console.WriteLine();
				for ( int j = 1 ; j<current ; j++ )
				{
					devides = true;
					foreach( int prime in primes )
					{
						if(j%prime == 0 )
						{
							devides = false;
							break;
						}
					}
					if(devides)
					{
						num++;
					}
				}
				result = (double)num/((double)(current-1));
				//Console.WriteLine(i + ". " + result);
				if( result < test)
				{
					Console.WriteLine(current + ". " + result + " " +1/result + " " + num + " " + (current-1)); 
					//Console.Write(current + ". ");
					//foreach (int prime in primes ){Console.Write(prime + " " );}
					//factors(current);
					//Console.WriteLine();
					check = false;
					break;
					//test=result;
				}
			}
			if(i==primes2[cnt])
			{
				bases*=i;
				cnt++;
			}
			Console.WriteLine(current + "  "+ i);
		}
	}
	static int[] p(int x){
		int check = 0;
		string num = "";
		for (int i = 2 ; x!=1 ; i++)
		{
			if (x%i==0){
				x/=i;
				//Console.Write(" "+i);
				if(check!=i)
				{
					num+=i+" ";
					check = i;
				}
				i--;
			}
		}
		string[] nums = num.Split(' ');
		int[] output = new int[nums.Length-1];
		for( int i = 0 ; i< nums.Length-1 ; i++ )
		{
			output[i] = int.Parse(nums[i]);
		}
		return output;
	}
	static void f(int x){
		for (int i = 1; i<x ; i++)
		{
			if (x%i==0){
				Console.Write(" "+i);
			}
		}
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
	static void factors(int x){
		for (int i = 2 ; x!=1 ; i++)
		{
			if (x%i==0){
				x/=i;
				Console.Write(" "+i);
				i--;
			}
		}
	}
}