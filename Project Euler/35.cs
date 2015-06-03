using System;

class dkafldjaf
{
	static void Main()
	{
		int a = 0;
		for (int i = 1 ; i <= 1e6 ; i++)
		{
			int g = 0;
			string s = Convert.ToString(i);
			char[] o = s.ToCharArray();
			for (int k = 0 ; k < s.Length ; k++)
			{
				char x = o[0];
				for (int j = 0 ; j < s.Length ; j++)
				{
				
					if (j!=s.Length-1)
					{
						o[j]=o[j+1];
					}else{
						o[j] = x;
					}
				}
				string b = new string(o);
				int c = int.Parse(b);
				//Console.WriteLine(c);
				for (int p = 2 ; p < c ; p++)
				{
					if (c%p==0)
					{
						break;
					}
					if (p==c-1)
					{
						g++;
					}
				}
				if (g == s.Length)
				{
					a++;
					Console.WriteLine(c);
				}
			}

		}
		Console.WriteLine(a+1);
	}		
}