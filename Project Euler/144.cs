using System;

class dkafldjaf
{
	static void Main()
	{
		int cnt = 0;
		double pointX = 0.0;
		double pointY = 10.1;
		
		double pointX2 = 1.4;
		double pointY2 = -9.6;
		bool check=false;
		
		while(true){
		double slope = (pointY2-pointY)/(pointX2-pointX);
		double slopeP = -4*pointX2/pointY2;
		double angle = Math.Acos((slope*slopeP+1)/(Math.Sqrt(1+slope*slope)*Math.Sqrt(1+slopeP*slopeP)));
		
		double slope2 = (-Math.Sin(-angle)+slopeP*Math.Cos(-angle))/(Math.Cos(-angle)+slopeP*Math.Sin(-angle));
		//Console.WriteLine(slope + " " + slopeP + " " + angle + " " + slope2);
		if( Math.Abs(slope2 - slope)<= 0.00001)
		{
			angle = -angle;
			slope2 = (-Math.Sin(-angle)+slopeP*Math.Cos(-angle))/(Math.Cos(-angle)+slopeP*Math.Sin(-angle));
		}
		
		double linearB = (slope2*(-pointX2)+pointY2);
		double c = linearB*linearB-100;
		double b = linearB*2*slope2;
		double a = slope2*slope2+4;
		double[] options = quadratic(a,b,c);
		Console.WriteLine(options[0]);
		Console.WriteLine(options[1]);
		if( Math.Abs(options[0] - pointX2)<= 0.00001)
		{
			pointX = pointX2;
			pointY = pointY2;
			pointY2=options[1]*slope2 + linearB;
			pointX2=options[1];
		} else {
			pointX = pointX2;
			pointY = pointY2;
			pointY2=options[0]*slope2 + linearB;
			pointX2=options[0];
		}
		Console.WriteLine();
		Console.WriteLine(pointX2+ ","+pointY2);
		Console.WriteLine(pointX+ ","+pointY);
		Console.WriteLine();
		Console.WriteLine();
		cnt++;
		if(Math.Abs(pointX2)<=0.01 && Math.Abs(pointY2)==pointY2)
		{
			Console.WriteLine(cnt);
			//if(check){
			break;
			//}
			//check=true;
		}
		}
		//Console.WriteLine(slope);
		//Console.WriteLine(slope2);
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
	static double[] quadratic ( double a , double b , double c )
	{
		double[] x = new double[2];
		x[0] = (-b + Math.Sqrt (b*b-4*a*c))/(2*a);
		x[1] = (-b - Math.Sqrt (b*b-4*a*c))/(2*a);
		return x;
	}
}