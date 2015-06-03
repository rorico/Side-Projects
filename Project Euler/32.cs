using System;

class dkafldjaf
{
	static void Main()
	{
		int sum = 0;
		int[] y = new int[100] ;
		int index = 0;
		for( int i = 1 ; i<4e3 ; i++)
		{
			for (int j = 1 ; j<i ; j++)
			{
				int k = i*j;
				string a = Convert.ToString(i) ; 
				string b = Convert.ToString(j) ;
				string c = Convert.ToString(k) ;
				string d = a+b+c;
				char[] x = d.ToCharArray();
				if (x.Length!=9)
				{
					continue;
				}
				Array.Sort(x);
				for ( int m = 0; m<9 ; m++)
				{
					if (Char.GetNumericValue(x[m])!=m+1)
					{
						break;
					}
					if (m==8)
					{
						Console.WriteLine("{0} {1} {2}",i,j,k);
						y[index] = k;
						index++;
					}
				}
			}
		}
		Array.Sort(y);
		for (int i = 0 ; i<100 ; i++)
		{
			Console.WriteLine(y[i]);
		}
		
		
		for ( int i = 1 ; i<100 ; i++)
		{
			if(y[i-1]!=y[i])
			{
				sum+=y[i];
			}
		}
		Console.WriteLine(sum);
	}
}