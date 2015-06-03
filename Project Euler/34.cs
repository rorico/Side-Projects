using System;

class dkafldjaf
{
	static void Main()
	{
		int a = 0;
		int b = 1;
		int d = 0;
		for (int i = 3 ; i <= 1e7		; i++)
		{
			a=0;
			string s = Convert.ToString(i);
			char[] o = s.ToCharArray();
			for (int k = 0 ; k < s.Length ; k++)
			{
				b=1;
				int c = o[k] - '0';
				for (int j = 1 ; j <= c ; j++)
				{
					b =b*j;
					//Console.WriteLine(b);
				}
				a+=b;
				//Console.WriteLine(a);
			}
			if (a==i)
			{
				d+=i;
				Console.WriteLine(i);
			}
			
		}
		Console.WriteLine(d);
	}		
}