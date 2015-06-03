using System;

class dkafldjaf
{
	static void Main()
	{
		int c = 0;
		for (int i = 1 ; i<= 1e4 ; i++)
		{
			int a = 0;
			for (int j = 1 ; j <= i/2 ; j++)
			{
				if (i%j==0)
				{
					a+=j;
				}
			}
			//Console.WriteLine(a);
			int b = 0;
			if (a!=i)
			{
				for (int j = 1 ; j <= a/2 ; j++)
				{
					if (a%j==0)
					{
						b+=j;
					}
				}
			}
				//Console.WriteLine(b+"\n");
			if (b==i)
			{
				c+=i;
				Console.WriteLine(i+" "+a+"\n");
			}
			
		
		}
		Console.WriteLine(c);
	}		
}