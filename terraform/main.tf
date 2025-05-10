terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {        
    region         = "af-south-1"
  }
}

provider "aws" {
  region =  "af-south-1"
}

resource "aws_default_vpc" "default_vpc" {
  tags = {
    Name = "default_vpc"
  }
}

data "aws_availability_zones" "available_zones" { }

resource "aws_default_subnet" "subnet_az1" {
  availability_zone = data.aws_availability_zones.available_zones.names[0]
}

resource "aws_default_subnet" "subnet_az2" {
  availability_zone = data.aws_availability_zones.available_zones.names[1]
}

resource "aws_security_group" "allow_postgres" {
  name_prefix = "allow_postgres_"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_secretsmanager_secret_version" "pguser" {
  secret_id = "pguser"
}

data "aws_secretsmanager_secret_version" "pgpassword" {
  secret_id = "pgpassword"
}

resource "aws_db_instance" "innerlensdb" {
  identifier             = "innerlensdb"
  engine                 = "postgres"
  engine_version         = "16.4"
  instance_class         = "db.t4g.micro"
  db_name                = "innerlensdb"
  allocated_storage      = 20
  storage_type           = "gp2"
  publicly_accessible    = true
  username = data.aws_secretsmanager_secret_version.pguser.secret_string
  password = data.aws_secretsmanager_secret_version.pgpassword.secret_string
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.allow_postgres.id]
  tags = {
    Name = "innerlensdb"
  }
}

output "db_host" {
  value       = aws_db_instance.innerlensdb.endpoint
  description = "The endpoint of the Postgres Server RDS instance"
}

resource "aws_security_group" "ec2_security_group" {
  name_prefix = "innerlens_api_sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "innerlens_ec2_instance" {
  ami           = "ami-0b7e05c6022fc830b"
  instance_type = "t3.micro"
  key_name      = "innerlens-key"
  tags = {
    Name = "innerlens_ec2_instance"
  }

  vpc_security_group_ids = [ aws_security_group.ec2_security_group.id ]
}

resource "aws_eip" "innerlens_ec2_eip" {
  instance = aws_instance.innerlens_ec2_instance.id
  domain   = "vpc"
}

output "ec2_host" {
  value       = aws_eip.innerlens_ec2_eip.public_dns
  description = "The endpoint of the EC2 instance"
}
