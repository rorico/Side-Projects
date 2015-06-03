using System;

class dkafldjaf
{
	static void Main()
	{
		BigInteger a = 1;
		int x = 0;
		for (long i = 100; i>=1 ; i--)
		{
			a*=i;
			Console.WriteLine(a);
		}
		Console.WriteLine(a);
		string s = Convert.ToString(a);
		char[] b = s.ToCharArray();
		for ( int j = 0; j < b.Length ; j++)
		{
			x+=b[j]-'0';
		}
		Console.WriteLine(x);
	}		
}